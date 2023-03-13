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
		super(
		{
			ignoreExpiration: false, // Do not ignore the expiration.
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Look in the header of the request and get the bearer token from there.
			secretOrKey: configService.get('TOKEN_SECRET') // Use the secret key.
		});
	}

	async validate( payload: any )
	{
		// This value is saved in the request.
		return {
			username: payload.sub
		};
	}
}