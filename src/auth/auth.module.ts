import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		forwardRef(() => UsersModule), // Circular dependency resolved.
		PassportModule,
		JwtModule.registerAsync(
			// Get the configuration settings from the config service asynchronously.
			{
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => {
					return {
						secret: configService.getEnvironmentVariable('TOKEN_SECRET'),
						signOptions: { expiresIn: configService.getEnvironmentVariable('TOKEN_EXPIRATION_TIME') },
					};
				},
			},
		),
		MailModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
