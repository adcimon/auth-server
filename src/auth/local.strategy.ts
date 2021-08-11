import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly authService: AuthService )
    {
        // Pass a configuration object to change the strategy.
        // Use email instead of username.
        super({ usernameField: "email" });
    }

    async validate( email: string, password: string ): Promise<User>
    {
        try
        {
            const user = await this.authService.validate(email, password);
            return user; // Passport saves the user in the request.
        }
        catch( exception )
        {
            throw exception;
        }
    }
}