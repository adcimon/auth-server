import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { AuthController } from './auth.controller';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module(
{
    imports:
    [
        // * User module.
        // Circular dependency resolved.
        forwardRef(() => UserModule),

        // * Passport module.
        PassportModule,

        // * Jwt module.
        // Get the configuration settings from the config service asynchronously.
        JwtModule.registerAsync(
        {
            inject: [ConfigService],
            useFactory: ( configService: ConfigService ) =>
            {
                return {
                    secret: configService.get('TOKEN_SECRET_KEY'),
                    signOptions: { expiresIn: configService.get('TOKEN_EXPIRATION_TIME') }
                };
            }
        }),

        // * Mail module.
        MailModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule
{
}