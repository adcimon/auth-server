import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { EmailNotVerifiedException } from '../exceptions/email-not-verified.exception';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Validate the email and password.
	 */
	public async validate(email: string, password: string): Promise<User> {
		const user: User = await this.usersService.getByEmail(email);
		if (!user) {
			throw new UserNotFoundException();
		}

		const valid: boolean = await argon2.verify(user.password, password);
		if (!valid) {
			throw new InvalidCredentialsException();
		}

		return user;
	}

	/**
	 * Create an access token for the user.
	 */
	public async createAccessToken(user: User): Promise<string> {
		if (!user.verified) {
			throw new EmailNotVerifiedException();
		}

		const payload: object = {
			sub: user.username,
		};

		return this.jwtService.sign(payload);
	}

	/**
	 * Create a verification token for the user.
	 */
	public async createVerificationToken(user: User): Promise<string> {
		const payload: object = {
			sub: user.username,
		};

		return this.jwtService.sign(payload, {
			expiresIn: this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME'),
		});
	}

	/**
	 * Verify the user's email.
	 */
	public async verifyEmail(token: string): Promise<boolean> {
		let payload: any;
		try {
			payload = this.jwtService.verify(token, this.configService.get('TOKEN_SECRET'));
		} catch (error: any) {
			throw new InvalidTokenException();
		}

		const user: User = await this.usersService.getByUsername(payload.sub);
		if (user.verified) {
			return false;
		}

		await this.usersService.updateVerified(user.id, true);

		return true;
	}

	/**
	 * Create a change email token for the user.
	 */
	public async createChangeEmailToken(user: User, email: string): Promise<string> {
		const payload: object = {
			sub: user.username,
			email: email,
		};

		// Use the user's current email for signing the token.
		// All tokens generated before a successful email change would get invalidated.
		return this.jwtService.sign(payload, {
			secret: user.email,
			expiresIn: this.configService.get('TOKEN_CHANGE_EMAIL_EXPIRATION_TIME'),
		});
	}

	/**
	 * Change the user's email.
	 */
	public async changeEmail(token: string): Promise<boolean> {
		// Get the user.
		let payload: any = this.jwtService.decode(token);
		const user: User = await this.usersService.getByUsername(payload.sub);
		if (!user) {
			throw new UserNotFoundException();
		}

		// The token is signed with the user's current email.
		// A successful email change will invalidate the token.
		payload = null;
		try {
			payload = this.jwtService.verify(token, { secret: user.email });
		} catch (error: any) {
			throw new InvalidTokenException();
		}

		await this.usersService.updateEmail(user.id, payload.email);

		return true;
	}

	/**
	 * Create a change password token for the user.
	 */
	public async createChangePasswordToken(user: User): Promise<string> {
		const payload: object = {
			sub: user.username,
		};

		// Use the user's current password's hash for signing the token.
		// All tokens generated before a successful password change would get invalidated.
		return this.jwtService.sign(payload, {
			secret: user.password,
			expiresIn: this.configService.get('TOKEN_CHANGE_PASSWORD_EXPIRATION_TIME'),
		});
	}

	/**
	 * Change the user's password.
	 */
	public async changePassword(token: string, password: string): Promise<boolean> {
		// Get the user.
		let payload: any = this.jwtService.decode(token);
		const user: User = await this.usersService.getByUsername(payload.sub);
		if (!user) {
			throw new UserNotFoundException();
		}

		// The token is signed with the user's current password's hash.
		// A successful password change will invalidate the token.
		payload = null;
		try {
			payload = this.jwtService.verify(token, { secret: user.password });
		} catch (error: any) {
			throw new InvalidTokenException();
		}

		if (!user.verified) {
			throw new EmailNotVerifiedException();
		}

		await this.usersService.updatePassword(user.id, password);

		return true;
	}
}
