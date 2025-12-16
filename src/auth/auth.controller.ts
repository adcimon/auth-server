import {
	Controller,
	Get,
	Post,
	Request,
	Response,
	Param,
	Headers,
	Body,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { ValidationPipe } from '../validation/validation.pipe';
import { ValidationSchema } from '../validation/validation.schema';
import { AuthSchema } from './auth.schema';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { PasswordInterceptor } from '../interceptors/password.interceptor';
import { MailServiceErrorException } from '../exceptions/mail-service-error.exception';

@Controller('')
@UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
export class AuthController {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly mailService: MailService,
	) {}

	@Post('/signup')
	@UseInterceptors(PasswordInterceptor)
	async signup(@Headers() headers, @Body(new ValidationPipe(AuthSchema.SignUpBody)) body: any): Promise<object> {
		const user: User = await this.usersService.create(
			body.username,
			body.password,
			body.email,
			body.avatar,
			body.name,
			body.surname,
			body.birthdate,
		);

		const token: string = await this.authService.createVerificationToken(user);
		const link: string = 'https://' + headers.host + '/verify/' + token;

		const sent: boolean = await this.mailService.sendVerificationMail(user, link);
		if (!sent) {
			this.usersService.delete(user.id);
			throw new MailServiceErrorException();
		}

		return { user };
	}

	@Post('/signdown')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@UseInterceptors(PasswordInterceptor)
	@Roles(RoleEnum.USER)
	async signdown(@Request() request, @Body(new ValidationPipe(AuthSchema.SignDownBody)) body: any): Promise<object> {
		const user: User = await this.usersService.deleteSecure(request.user.id, body.password);
		return { user };
	}

	@Post('/signin')
	@UseGuards(LocalAuthGuard)
	async signin(@Request() request, @Body(new ValidationPipe(AuthSchema.SignInBody)) body: any): Promise<object> {
		const token: string = await this.authService.createAccessToken(request.user);
		return { token };
	}

	@Get('/verify-email/:token')
	async verify(
		@Param('token', new ValidationPipe(ValidationSchema.TokenSchema)) token: string,
		@Response() response,
	): Promise<any> {
		const verified: boolean = await this.authService.verifyEmail(token);

		let link: any = this.configService.getVariable('VERIFY_EMAIL_LINK');
		if (!link || link === '') {
			response.send({ verified });
		} else {
			link += (link.endsWith('/') ? '' : '/') + token;
			response.redirect(link);
		}
	}

	@Get('/change-email/:token')
	async changeEmail(
		@Param('token', new ValidationPipe(ValidationSchema.TokenSchema)) token: string,
		@Response() response,
	): Promise<any> {
		const changed: boolean = await this.authService.changeEmail(token);

		let link: any = this.configService.getVariable('CHANGE_EMAIL_LINK');
		if (!link || link === '') {
			response.send({ changed });
		} else {
			response.redirect(link);
		}
	}

	@Post('/forgot-password')
	async forgotPassword(
		@Headers() headers,
		@Body(new ValidationPipe(AuthSchema.ForgotPasswordBody)) body: any,
	): Promise<object> {
		const user: User = await this.usersService.getByEmail(body.email);
		const token: string = await this.authService.createChangePasswordToken(user);

		let link: any = this.configService.getVariable('CHANGE_PASSWORD_LINK');
		if (!link || link === '') {
			link += 'https://' + headers.host + '/change-password/' + token;
		} else {
			link += (link.endsWith('/') ? '' : '/') + token;
		}

		const sent: boolean = await this.mailService.sendChangePasswordMail(user, link);
		if (!sent) {
			throw new MailServiceErrorException();
		}

		return { sent };
	}

	@Post('/change-password/:token')
	@UseInterceptors(PasswordInterceptor)
	async changePassword(
		@Param('token', new ValidationPipe(ValidationSchema.UsernameSchema)) token: string,
		@Body(new ValidationPipe(AuthSchema.ChangePasswordBody)) body: any,
	): Promise<object> {
		const changed: boolean = await this.authService.changePassword(token, body.password);
		return { changed };
	}
}
