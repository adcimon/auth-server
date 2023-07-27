import {
	Controller,
	Get,
	Patch,
	Delete,
	Request,
	Param,
	Headers,
	Body,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { ValidationPipe } from '../validation/validation.pipe';
import { ValidationSchema } from '../validation/validation.schema';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { PasswordInterceptor } from '../interceptors/password.interceptor';
import { MailServiceErrorException } from '../exceptions/mail-service-error.exception';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
		private readonly mailService: MailService,
	) {}

	@Get('')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async getUsers(): Promise<object> {
		const users: User[] = await this.usersService.getAll();
		return { users };
	}

	@Get('/me')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async getMyUser(@Request() request): Promise<object> {
		const user: User = await this.usersService.getById(request.user.id);
		return { user };
	}

	@Get('/:username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async getUser(@Param('username') username: string): Promise<object> {
		const user: User = await this.usersService.getByUsername(username);
		return { user };
	}

	@Get('/me/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async getMyAvatar(@Request() request): Promise<object> {
		const avatar: string = await this.usersService.getAvatarById(request.user.id);
		return { avatar };
	}

	@Get('/:username/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async getAvatar(@Param('username') username: string): Promise<object> {
		const avatar: string = await this.usersService.getAvatarByUsername(username);
		return { avatar };
	}

	@Patch('/me/username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@UseInterceptors(PasswordInterceptor)
	@Roles(RoleEnum.USER)
	async updateMyUsername(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyUsernameSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updateUsernameSecure(request.user.id, body.username, body.password);
		return { user };
	}

	@Patch('/:username/username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateUsername(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateUsernameSchema)) body: any,
	): Promise<object> {
		const userToUpdate: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.updateUsername(userToUpdate.id, body.username);
		return { user };
	}

	@Patch('/me/email')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER, RoleEnum.ADMIN)
	async updateMyEmail(
		@Request() request,
		@Headers() headers,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyEmailSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.getById(request.user.id);
		const token: string = await this.authService.createChangeEmailToken(user, body.email);
		const link: string = 'https://' + headers.host + '/change-email/' + token;

		const sent: boolean = await this.mailService.sendChangeEmailMail(body.email, link);
		if (!sent) {
			throw new MailServiceErrorException();
		}

		return { sent };
	}

	@Patch('/me/password')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@UseInterceptors(PasswordInterceptor)
	@Roles(RoleEnum.USER)
	async updateMyPassword(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyPasswordSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updatePasswordSecure(
			request.user.id,
			body.currentPassword,
			body.newPassword,
		);
		return { user };
	}

	@Patch('/me/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyAvatar(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyAvatarSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updateAvatar(request.user.id, body.avatar);
		return { user };
	}

	@Patch('/:username/avatar')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateAvatar(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateAvatarSchema)) body: any,
	): Promise<object> {
		const userToUpdate: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.updateAvatar(userToUpdate.id, body.avatar);
		return { user };
	}

	@Patch('/me/name')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyName(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyNameSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updateName(request.user.id, body.name);
		return { user };
	}

	@Patch('/:username/name')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateName(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateNameSchema)) body: any,
	): Promise<object> {
		const userToUpdate: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.updateName(userToUpdate.id, body.name);
		return { user };
	}

	@Patch('/me/surname')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMySurname(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMySurnameSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updateSurname(request.user.id, body.surname);
		return { user };
	}

	@Patch('/:username/surname')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateSurname(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateSurnameSchema)) body: any,
	): Promise<object> {
		const userToUpdate: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.updateSurname(userToUpdate.id, body.surname);
		return { user };
	}

	@Patch('/me/birthdate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.USER)
	async updateMyBirthdate(
		@Request() request,
		@Body(new ValidationPipe(ValidationSchema.UpdateMyBirthdateSchema)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.updateBirthdate(request.user.id, body.birthdate);
		return { user };
	}

	@Patch('/:username/birthdate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async updateBirthdate(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.UpdateBirthdateSchema)) body: any,
	): Promise<object> {
		const userToUpdate: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.updateBirthdate(userToUpdate.id, body.birthdate);
		return { user };
	}

	@Delete('/:username')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(RoleEnum.ADMIN)
	async deleteUser(
		@Param('username') username: string,
		@Body(new ValidationPipe(ValidationSchema.DeleteUserSchema)) body: any,
	): Promise<object> {
		const userToDelete: User = await this.usersService.getByUsername(username);
		const user: User = await this.usersService.delete(userToDelete.id);
		return { user };
	}
}
