import { Module } from '@nestjs/common';
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
        UserModule,
        PassportModule,
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
        MailModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule
{
}