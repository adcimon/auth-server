import { Controller, Get, Put, Request, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ValidationPipe } from '../validation/validation.pipe';
import { UpdateUsernameSchema, UpdatePasswordSchema, UpdateAvatarSchema, UpdateNameSchema, UpdateSurnameSchema, UpdateBirthdateSchema } from '../validation/validation.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

    @Put('/update/username')
    @UseGuards(JwtAuthGuard)
    updateUsername( @Request() request, @Body(new ValidationPipe(UpdateUsernameSchema)) body: any ): Promise<User>
    {
        return this.userService.updateUsernameSecure(request.user.id, body.username, body.password);
    }

    @Put('/update/password')
    @UseGuards(JwtAuthGuard)
    updatePassword( @Request() request, @Body(new ValidationPipe(UpdatePasswordSchema)) body: any ): Promise<User>
    {
        return this.userService.updatePasswordSecure(request.user.id, body.currentPassword, body.newPassword);
    }

    @Put('/update/avatar')
    @UseGuards(JwtAuthGuard)
    updateAvatar( @Request() request, @Body(new ValidationPipe(UpdateAvatarSchema)) body: any ): Promise<User>
    {
        return this.userService.updateAvatar(request.user.id, body.avatar);
    }

    @Put('/update/name')
    @UseGuards(JwtAuthGuard)
    updateName( @Request() request, @Body(new ValidationPipe(UpdateNameSchema)) body: any ): Promise<User>
    {
        return this.userService.updateName(request.user.id, body.name);
    }

    @Put('/update/surname')
    @UseGuards(JwtAuthGuard)
    updateSurname( @Request() request, @Body(new ValidationPipe(UpdateSurnameSchema)) body: any ): Promise<User>
    {
        return this.userService.updateSurname(request.user.id, body.surname);
    }

    @Put('/update/birthdate')
    @UseGuards(JwtAuthGuard)
    updateBirthdate( @Request() request, @Body(new ValidationPipe(UpdateBirthdateSchema)) body: any ): Promise<User>
    {
        return this.userService.updateBirthdate(request.user.id, body.birthdate);
    }
}