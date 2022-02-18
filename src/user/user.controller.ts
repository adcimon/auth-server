import { Controller, Get, Put, Request, Param, Body, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
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

    //@Get('/all')
    getAll(): Promise<User[]>
    {
        return this.userService.getAll();
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getMe( @Request() request ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.getById(user.id);
    }

    @Get('/:username/avatar')
    @UseGuards(JwtAuthGuard)
    async getAvatar( @Param('username') username: string ): Promise<object>
    {
        const avatar = await this.userService.getAvatar(username);
        return { avatar: avatar };
    }

    @Put('/update/username')
    @UseGuards(JwtAuthGuard)
    async updateUsername( @Request() request, @Body(new ValidationPipe(UpdateUsernameSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updateUsernameSecure(user.id, body.username, body.password);
    }

    @Put('/update/password')
    @UseGuards(JwtAuthGuard)
    async updatePassword( @Request() request, @Body(new ValidationPipe(UpdatePasswordSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updatePasswordSecure(user.id, body.currentPassword, body.newPassword);
    }

    @Put('/update/avatar')
    @UseGuards(JwtAuthGuard)
    async updateAvatar( @Request() request, @Body(new ValidationPipe(UpdateAvatarSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updateAvatar(user.id, body.avatar);
    }

    @Put('/update/name')
    @UseGuards(JwtAuthGuard)
    async updateName( @Request() request, @Body(new ValidationPipe(UpdateNameSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updateName(user.id, body.name);
    }

    @Put('/update/surname')
    @UseGuards(JwtAuthGuard)
    async updateSurname( @Request() request, @Body(new ValidationPipe(UpdateSurnameSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updateSurname(user.id, body.surname);
    }

    @Put('/update/birthdate')
    @UseGuards(JwtAuthGuard)
    async updateBirthdate( @Request() request, @Body(new ValidationPipe(UpdateBirthdateSchema)) body: any ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);
        return this.userService.updateBirthdate(user.id, body.birthdate);
    }
}