import
{
    Controller,
    Get, Patch, Delete,
    Request, Param, Headers, Body,
    UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../role/roles.decorator';
import { RoleEnum } from '../role/role.enum';
import { RolesGuard } from '../role/roles.guard';
import { ValidationPipe } from '../validation/validation.pipe';
import { ValidationSchema } from '../validation/validation.schema';
import { MailServiceErrorException } from '../exception/mail-service-error.exception';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController
{
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly mailService: MailService
	) { }

	@Get('/me')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async getMyUser(
		@Request() request
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.getById(user.id);
	}

	@Get('/:username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async getUser(
		@Param('username') username: string
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.getById(user.id);
	}

	@Get('')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async getUsers(): Promise<User[]>
	{
		return await this.usersService.getAll();
	}

	@Get('/me/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async getMyAvatar(
		@Request() request,
	): Promise<object>
	{
		const avatar: string = await this.usersService.getAvatar(request.user.username);
		return { avatar: avatar };
	}

	@Get('/:username/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async getAvatar(
		@Param('username') username: string
	): Promise<object>
	{
		const avatar: string = await this.usersService.getAvatar(username);
		return { avatar: avatar };
	}

	@Patch('/me/username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyUsername(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyUsernameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updateUsernameSecure(user.id, body.username, body.password);
	}

	@Patch('/:username/username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateUsername(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateUsernameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.updateUsername(user.id, body.username);
	}

	@Patch('/me/email')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async updateMyEmail(
		@Request() request,
		@Headers() headers,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyEmailSchema)) body: any
	): Promise<object>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		const token: string = await this.authService.createChangeEmailToken(user, body.email);
		const link: string = 'https://' + headers.host + '/change-email/' + token;

		const sent: boolean = await this.mailService.sendChangeEmailMail(body.email, link);
		if( !sent )
		{
			throw new MailServiceErrorException();
		}

		return { status: sent };
	}

	@Patch('/me/password')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyPassword(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyPasswordSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updatePasswordSecure(user.id, body.currentPassword, body.newPassword);
	}

	@Patch('/me/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyAvatar(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyAvatarSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updateAvatar(user.id, body.avatar);
	}

	@Patch('/:username/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateAvatar(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateAvatarSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.updateAvatar(user.id, body.avatar);
	}

	@Patch('/me/name')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyName(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyNameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updateName(user.id, body.name);
	}

	@Patch('/:username/name')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateName(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateNameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.updateName(user.id, body.name);
	}

	@Patch('/me/surname')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMySurname(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMySurnameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updateSurname(user.id, body.surname);
	}

	@Patch('/:username/surname')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateSurname(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateSurnameSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.updateSurname(user.id, body.surname);
	}

	@Patch('/me/birthdate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyBirthdate(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyBirthdateSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(request.user.username);
		return this.usersService.updateBirthdate(user.id, body.birthdate);
	}

	@Patch('/:username/birthdate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateBirthdate(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateBirthdateSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return this.usersService.updateBirthdate(user.id, body.birthdate);
	}

	@Delete('/:username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async deleteUser(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.DeleteUserSchema)) body: any
	): Promise<User>
	{
		const user: User = await this.usersService.getByUsername(username);
		return await this.usersService.delete(user.id);
	}
}