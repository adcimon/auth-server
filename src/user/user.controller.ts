import
{
    Controller,
    Get, Patch, Delete,
    Request, Param, Body,
    UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import
{
    UpdateMyUsernameSchema,     UpdateUsernameSchema,
    UpdateMyPasswordSchema,
    UpdateMyAvatarSchema,       UpdateAvatarSchema,
    UpdateMyNameSchema,         UpdateNameSchema,
    UpdateMySurnameSchema,      UpdateSurnameSchema,
    UpdateMyBirthdateSchema,    UpdateBirthdateSchema,
    DeleteMyUserSchema,         DeleteUserSchema
} from '../validation/validation.schema';
import { ValidationPipe } from '../validation/validation.pipe';

import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { RolesGuard } from '../role/roles.guard';
import { UserNotFoundException } from '../exception/user-not-found.exception';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController
{
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('/me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async getMyUser(
        @Request() request
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.getById(user.id);
    }

    @Get('/:username')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async getUser(
        @Param('username') username: string
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.getById(user.id);
    }

    @Get('')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async getUsers(): Promise<User[]>
    {
        return await this.userService.getAll();
    }

    @Get('/me/avatar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    async getMyAvatar(
        @Request() request,
    ): Promise<object>
    {
        const avatar = await this.userService.getAvatar(request.user.username);

        return { avatar: avatar };
    }

    @Get('/:username/avatar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.ADMIN)
    async getAvatar(
        @Param('username') username: string
    ): Promise<object>
    {
        const avatar = await this.userService.getAvatar(username);

        return { avatar: avatar };
    }

    @Patch('/me/username')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMyUsername(
        @Request() request,
        @Body(new ValidationPipe(UpdateMyUsernameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updateUsernameSecure(user.id, body.username, body.password);
    }

    @Patch('/:username/username')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async updateUsername(
        @Param('username') username: string,
        @Body(new ValidationPipe(UpdateUsernameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.updateUsername(user.id, body.username);
    }

    @Patch('/me/password')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMyPassword(
        @Request() request,
        @Body(new ValidationPipe(UpdateMyPasswordSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updatePasswordSecure(user.id, body.currentPassword, body.newPassword);
    }

    @Patch('/me/avatar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMyAvatar(
        @Request() request,
        @Body(new ValidationPipe(UpdateMyAvatarSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updateAvatar(user.id, body.avatar);
    }

    @Patch('/:username/avatar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async updateAvatar(
        @Param('username') username: string,
        @Body(new ValidationPipe(UpdateAvatarSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.updateAvatar(user.id, body.avatar);
    }

    @Patch('/me/name')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMyName(
        @Request() request,
        @Body(new ValidationPipe(UpdateMyNameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updateName(user.id, body.name);
    }

    @Patch('/:username/name')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async updateName(
        @Param('username') username: string,
        @Body(new ValidationPipe(UpdateNameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.updateName(user.id, body.name);
    }

    @Patch('/me/surname')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMySurname(
        @Request() request,
        @Body(new ValidationPipe(UpdateMySurnameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updateSurname(user.id, body.surname);
    }

    @Patch('/:username/surname')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async updateSurname(
        @Param('username') username: string,
        @Body(new ValidationPipe(UpdateSurnameSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.updateSurname(user.id, body.surname);
    }

    @Patch('/me/birthdate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async updateMyBirthdate(
        @Request() request,
        @Body(new ValidationPipe(UpdateMyBirthdateSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(request.user.username);

        return this.userService.updateBirthdate(user.id, body.birthdate);
    }

    @Patch('/:username/birthdate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async updateBirthdate(
        @Param('username') username: string,
        @Body(new ValidationPipe(UpdateBirthdateSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return this.userService.updateBirthdate(user.id, body.birthdate);
    }

    @Delete('/me/delete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER)
    async deleteMyUser(
        @Request() request,
        @Body(new ValidationPipe(DeleteMyUserSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.deleteSecure(request.user.id, body.password);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user;
    }

    @Delete('/:username/delete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    async deleteUser(
        @Param('username') username: string,
        @Body(new ValidationPipe(DeleteUserSchema)) body: any
    ): Promise<User>
    {
        const user = await this.userService.getByUsername(username);

        return await this.userService.delete(user.id);
    }
}