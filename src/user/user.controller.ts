import { Controller, Get, Put, Request, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { ValidationPipe } from '../validation/validation.pipe';
import { UpdateSchema, UpdateUsernameSchema, UpdatePasswordSchema, UpdateAvatarSchema } from '../validation/validation.schema';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController
{
    constructor( private readonly userService: UserService )
    {
    }

    @Get('/')
    getAll(): Promise<User[]>
    {
        return this.userService.getAll();
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    getMe( @Request() request ): Promise<User>
    {
        return this.userService.getById(request.user.id);
    }

    @Put('/update')
    @UseGuards(JwtAuthGuard)
    update( @Request() request, @Body(new ValidationPipe(UpdateSchema)) body: any ): Promise<User>
    {
        return this.userService.update(
            request.user.id,
            body.name,
            body.surname,
            body.birthdate,
            body.role,
        );
    }

    @Put('/update/username')
    @UseGuards(JwtAuthGuard)
    changeUsername( @Request() request, @Body(new ValidationPipe(UpdateUsernameSchema)) body: any ): Promise<User>
    {
        return this.userService.updateUsernameSecure(request.user.id, body.username, body.password);
    }

    @Put('/update/password')
    @UseGuards(JwtAuthGuard)
    changePassword( @Request() request, @Body(new ValidationPipe(UpdatePasswordSchema)) body: any ): Promise<User>
    {
        return this.userService.updatePasswordSecure(request.user.id, body.currentPassword, body.newPassword);
    }

    @Put('/update/avatar')
    @UseGuards(JwtAuthGuard)
    changeAvatar( @Request() request, @Body(new ValidationPipe(UpdateAvatarSchema)) body: any ): Promise<User>
    {
        return this.userService.updateAvatar(request.user.id, body.avatar);
    }
}