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
    ) { }

    /**
     * Validate the email and password.
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
     * Create an access token for the user.
     */
    async createAccessToken( user: User ): Promise<any>
    {
        if( !user.verified )
        {
            throw new NotVerifiedException();
        }

        const payload =
        {
            sub: user.username
        };

        return this.jwtService.sign(payload);
    }

    /**
     * Create a verification token for the user.
     */
    async createVerificationToken( user: User ): Promise<string>
    {
        const payload =
        {
            sub: user.username
        };

        return this.jwtService.sign(payload, { expiresIn: this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME') });
    }

    /**
     * Verify the user's email.
     */
    async verifyEmail( token: string ): Promise<boolean>
    {
        let payload;
        try
        {
            payload = this.jwtService.verify(token, this.configService.get('TOKEN_SECRET_KEY'));
        }
        catch( exception )
        {
            throw new InvalidTokenException();
        }

        const user = await this.userService.getByUsername(payload.sub);
        if( user.verified )
        {
            return false;
        }

        await this.userService.updateVerified(user.id, true);

        return true;
    }

    /**
     * Create a reset password token for the user.
     */
    async createResetPasswordToken( user: User ): Promise<string>
    {
        const payload =
        {
            sub: user.username
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
     */
    async resetPassword( token: string, password: string ): Promise<boolean>
    {
        // Get the user.
        let payload = this.jwtService.decode(token);
        const user = await this.userService.getByUsername(payload.sub);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        // The token is signed with the user's current password's hash.
        // A successful password change will invalidate the token.
        payload = null;
        try
        {
            payload = this.jwtService.verify(token, { secret: user.password });
        }
        catch( exception )
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

    /**
     * Create a change email token for the user.
     */
    async createChangeEmailToken( user: User, email: string ): Promise<string>
    {
        const payload =
        {
            sub: user.username,
            email: email
        };

        // Use the user's current email for signing the token.
        // All tokens generated before a successful email change would get invalidated.
        return this.jwtService.sign(payload,
        {
            secret: user.email,
            expiresIn: this.configService.get('TOKEN_CHANGE_EMAIL_EXPIRATION_TIME')
        });
    }

    /**
     * Confirm the user's email change.
     */
    async confirmEmailChange( token: string ): Promise<boolean>
    {
        // Get the user.
        let payload = this.jwtService.decode(token);
        const user = await this.userService.getByUsername(payload.sub);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        // The token is signed with the user's current email.
        // A successful email change will invalidate the token.
        payload = null;
        try
        {
            payload = this.jwtService.verify(token, { secret: user.email });
        }
        catch( exception )
        {
            throw new InvalidTokenException();
        }

        await this.userService.updateEmail(user.id, payload.email);

        return true;
    }
}