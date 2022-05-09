import
{
    Controller,
    Get, Post,
    Request, Response, Param, Headers, Body,
    UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import { User } from '../user/user.entity';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ValidationPipe } from '../validation/validation.pipe';
import { ValidationSchema } from '../validation/validation.schema';
import { MailServiceErrorException } from '../exception/mail-service-error.exception';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController
{
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) { }

    @Post('/register')
    async register(
        @Headers() headers,
        @Body(new ValidationPipe(ValidationSchema.RegisterSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.create(
            body.username,
            body.password,
            body.email,
            body.avatar,
            body.name,
            body.surname,
            body.birthdate
        );

        const token = await this.authService.createVerificationToken(user);

        const link = 'https://' + headers.host + '/verify/' + token;

        const sent = await this.mailService.sendVerificationMail(user, link);
        if( !sent )
        {
            this.userService.delete(user.id);

            throw new MailServiceErrorException();
        }

        return user;
    }

    @Get('/verify/:token')
    async verify(
        @Param('token') token: string,
        @Response() response
    ): Promise<any>
    {
        const verified = await this.authService.verifyEmail(token);

        let link = this.configService.get('VERIFY_EMAIL_LINK');
        if( !link || link === '' )
        {
            response.send({ status: verified });
        }
        else
        {
            link += ((link.endsWith('/')) ? '' : '/') + token;
            response.redirect(link);
        }
    }

    @Post('auth/basic')
    @UseGuards(LocalAuthGuard)
    async basic(
        @Request() request
    ): Promise<object>
    {
        const token = await this.authService.createAccessToken(request.user);

        return { token: token };
    }

    @Post('/forgot-password')
    async forgotPassword(
        @Headers() headers,
        @Body(new ValidationPipe(ValidationSchema.ForgotPasswordSchema)) body: any
    ): Promise<object>
    {
        const user = await this.userService.getByEmail(body.email);

        const token = await this.authService.createResetPasswordToken(user);

        let link = this.configService.get('RESET_PASSWORD_LINK');
        if( !link || link === '' )
        {
            link += 'https://' + headers.host + '/reset-password/' + token;
        }
        else
        {
            link += ((link.endsWith('/')) ? '' : '/') + token;
        }

        const sent = await this.mailService.sendResetPasswordMail(user, link);
        if( !sent )
        {
            throw new MailServiceErrorException();
        }

        return { status: sent };
    }

    @Post('/reset-password/:token')
    async resetPassword(
        @Param('token') token: string,
        @Body(new ValidationPipe(ValidationSchema.ResetPasswordSchema)) body: any
    ): Promise<object>
    {
        const reset = await this.authService.resetPassword(token, body.password);

        return { status: reset };
    }

    @Get('/change-email/:token')
    async changeEmail(
        @Param('token') token: string,
        @Response() response
    ): Promise<any>
    {
        const confirmed = await this.authService.confirmEmailChange(token);

        let link = this.configService.get('CHANGE_EMAIL_LINK');
        if( !link || link === '' )
        {
            response.send({ status: confirmed });
        }
        else
        {
            response.redirect(link);
        }
    }
}