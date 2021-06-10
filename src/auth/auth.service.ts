import { Injectable, HttpException, NotFoundException, UnauthorizedException, HttpStatus } from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';

import * as argon2 from 'argon2';

@Injectable()
export class AuthService
{
    constructor( private readonly configService: ConfigService, private readonly userService: UserService, private readonly jwtService: JwtService )
    {
    }

    /**
     * Validate the email and password.
     * @param email
     * @param password
     * @returns User
     */
    async validate( email: string, password: string ): Promise<User>
    {
        const user = await this.userService.getByEmail(email);
        if( !user )
        {
            throw new NotFoundException();
        }

        const valid = await argon2.verify(user.password, password);
        if( !valid )
        {
            throw new UnauthorizedException();
        }

        return user;
    }

    /**
     * Log in the user.
     * @param user
     * @returns any
     */
    async login( user: User ): Promise<any>
    {
        if( !user.verified )
        {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Email is not verified', error: 'Bad Request' }, HttpStatus.BAD_REQUEST);
        }

        const payload =
        {
            sub: user.id,
            username: user.username
        };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    /**
     * Create a verification token for the user.
     * @param user
     * @returns string
     */
    async createVerificationToken( user: User ): Promise<string>
    {
        const payload =
        {
            sub: user.id,
            username: user.username
        };

        return this.jwtService.sign(payload, { expiresIn: this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME') });
    }

    /**
     * Verify the user.
     * @param token
     */
    async verify( token: string ): Promise<boolean>
    {
        try
        {
            const payload = this.jwtService.verify(token, this.configService.get('TOKEN_SECRET_KEY'));
            if( !payload )
            {
                throw new UnauthorizedException();
            }

            const user = await this.userService.getById(payload.sub);
            if( user.verified )
            {
                return false;
            }

            await this.userService.updateVerified(user.id, true);

            return true;
        }
        catch( exception )
        {
            throw new UnauthorizedException();
        }
    }

    /**
     * Create a reset password token for the user.
     * @param user
     * @returns string
     */
    async createResetPasswordToken( user: User ): Promise<string>
    {
        const payload =
        {
            sub: user.id,
            username: user.username
        };

        // Use the user's current password's hash for signing the token.
        // All tokens generated before a successful password change would get invalidated.
        return this.jwtService.sign(payload,
        {
            secret: user.password,
            expiresIn: this.configService.get('TOKEN_RESET_PASSWORD_EXPIRATION_TIME')
        });
    }

    /**
     * Reset the user's password.
     * @param token
     * @param password
     * @returns boolean
     */
    async resetPassword( token: string, password: string ): Promise<boolean>
    {
        try
        {
            const payload = this.jwtService.decode(token);
            const user = await this.userService.getById(payload.sub);

            // The token is signed with the user's current password's hash.
            // A successful password change will invalidate the token.
            this.jwtService.verify(token, { secret: user.password });

            if( !user.verified )
            {
                return false;
            }

            await this.userService.updatePassword(user.id, password);

            return true;
        }
        catch( exception )
        {
            throw new UnauthorizedException();
        }
    }
}