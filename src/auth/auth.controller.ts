import { Controller, Get, Post, Delete, Request, Param, Headers, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
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
    verify( @Param('token') token: string ): Promise<boolean>
    {
        return this.authService.verifyEmail(token);
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login( @Request() request ): Promise<any>
    {
        return await this.authService.login(request.user);
    }

    @Post('/forgot-password')
    async forgotPassword( @Headers() headers, @Body(new ValidationPipe(ForgotPasswordSchema)) body: any ): Promise<boolean>
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

        return true;
    }

    @Post('/reset-password/:token')
    async resetPassword( @Param('token') token: string, @Body(new ValidationPipe(ResetPasswordSchema)) body: any ): Promise<boolean>
    {
        return await this.authService.resetPassword(token, body.password);
    }

    @Delete('/delete')
    @UseGuards(JwtAuthGuard)
    async delete( @Request() request, @Body(new ValidationPipe(DeleteSchema)) body: any ): Promise<boolean>
    {
        const user = await this.userService.deleteSecure(request.user.id, body.password);
        return true;
    }
}