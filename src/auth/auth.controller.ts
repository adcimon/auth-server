import { Controller, Get, Post, Delete, Request, Param, Headers, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor, HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

import { User } from '../user/user.entity';

import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

import { ValidationPipe } from '../validation/validation.pipe';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, DeleteSchema } from '../validation/validation.schema';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController
{
    constructor( private readonly authService: AuthService, private readonly userService: UserService, private readonly mailService: MailService )
    {
    }

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

            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Verification mail error', error: 'Bad Request' }, HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    @Get('/verify/:token')
    verify( @Param('token') token: string ): Promise<boolean>
    {
        return this.authService.verify(token);
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

        const token = await this.authService.createResetPasswordToken(user);
        const link = 'https://' + headers.host + '/reset-password/' + token;

        const sent = await this.mailService.sendResetPasswordMail(user, link);
        if( !sent )
        {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Reset password mail error', error: 'Bad Request' }, HttpStatus.BAD_REQUEST);
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