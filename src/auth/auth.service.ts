import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserNotFoundException } from '../exception/user-not-found.exception';
import { InvalidPasswordException } from '../exception/invalid-password.exception';
import { NotVerifiedException } from '../exception/not-verified.exception';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService
{
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    )
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
            throw new UserNotFoundException();
        }

        const valid = await argon2.verify(user.password, password);
        if( !valid )
        {
            throw new InvalidPasswordException();
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
            throw new NotVerifiedException();
        }

        const payload =
        {
            sub: user.id,
            username: user.username,
            role: user.role
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
        const payload = this.jwtService.verify(token, this.configService.get('TOKEN_SECRET_KEY'));
        if( !payload )
        {
            throw new InvalidTokenException();
        }

        const user = await this.userService.getById(payload.sub);
        if( user.verified )
        {
            throw new NotVerifiedException();
        }

        await this.userService.updateVerified(user.id, true);

        return true;
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
        // Get the user's current password's hash.
        let payload = this.jwtService.decode(token);
        const user = await this.userService.getById(payload.sub);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        // The token is signed with the user's current password's hash.
        // A successful password change will invalidate the token.
        payload = null;
        payload = this.jwtService.verify(token, { secret: user.password });
        if( !payload )
        {
            throw new InvalidTokenException();
        }

        if( !user.verified )
        {
            throw new NotVerifiedException();
        }

        await this.userService.updatePassword(user.id, password);

        return true;
    }
}