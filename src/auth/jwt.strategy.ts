import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor( private readonly configService: ConfigService )
    {
        // Pass a configuration object to change the strategy.
        // Do NOT ignore the expiration.
        // Look in the header of the request and get the bearer token from there.
        // Use the secret key.
        super(
        {
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('TOKEN_SECRET_KEY')
        });
    }

    async validate( payload: any )
    {
        // This value is saved in the request.
        return {
            id: payload.sub,
            username: payload.username
        };
    }
}