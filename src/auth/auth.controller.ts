import { Controller, Get, Post, Delete, Request, Response, Param, Headers, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { User } from '../user/user.entity';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ValidationPipe } from '../validation/validation.pipe';
import { RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, DeleteSchema } from '../validation/validation.schema';
import { UserNotFoundException } from '../exception/user-not-found.exception';
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
    async register( @Headers() headers, @Body(new ValidationPipe(RegisterSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.create(
            body.username,
            body.password,
            body.email,
            body.avatar,
            body.name,
            body.surname,
            body.birthdate,
            body.role
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
    async verify( @Response() response, @Param('token') token: string )
    {
        const verified = await this.authService.verifyEmail(token);

        let link = this.configService.get('VERIFY_EMAIL_LINK');
        if( !link || link === '' )
        {
            response.send({ status: verified });
        }
        else
        {
            response.redirect(link);
        }
    }

    @Post('/auth/basic')
    @UseGuards(LocalAuthGuard)
    async basic( @Request() request ): Promise<object>
    {
        const token = await this.authService.createAccessToken(request.user);

        return { access_token: token };
    }

    @Post('/forgot-password')
    async forgotPassword( @Headers() headers, @Body(new ValidationPipe(ForgotPasswordSchema)) body: any ): Promise<object>
    {
        const user = await this.userService.getByEmail(body.email);
        if( !user )
        {
            throw new UserNotFoundException();
        }

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
    async resetPassword( @Param('token') token: string, @Body(new ValidationPipe(ResetPasswordSchema)) body: any ): Promise<object>
    {
        const reset = await this.authService.resetPassword(token, body.password);

        return { status: reset };
    }

    @Delete('/delete')
    @UseGuards(JwtAuthGuard)
    async delete( @Request() request, @Body(new ValidationPipe(DeleteSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.deleteSecure(request.user.id, body.password);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user;
    }
}