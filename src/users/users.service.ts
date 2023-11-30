import { Inject, Injectable, Logger, OnModuleInit, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConfigService } from '../config/config.service';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/role.entity';
import { UsernameTakenException } from '../exceptions/username-taken.exception';
import { EmailTakenException } from '../exceptions/email-taken.exception';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import * as argon2 from 'argon2';
import * as ms from 'ms';
const fs = require('fs');

@Injectable()
export class UsersService implements OnModuleInit {
	private readonly cronLogger = new Logger('CRON');

	constructor(
		@InjectRepository(User) private usersRepository: Repository<User>,
		private readonly configService: ConfigService,
		@Inject(forwardRef(() => RolesService)) private readonly rolesService: RolesService,
	) {}

	public async onModuleInit() {
		if (!this.configService.isProduction()) {
			await this.populateDummyUsers();
		}
	}

	/**
	 * Create a user.
	 */
	public async create(
		username: string,
		password: string,
		email: string,
		avatar: string,
		name: string,
		surname: string,
		birthdate: Date,
		roles: string[] = ['user'],
	): Promise<User> {
		const usernameTaken: User = await this.usersRepository.findOne({ where: { username } });
		if (usernameTaken) {
			throw new UsernameTakenException();
		}

		const emailTaken: User = await this.usersRepository.findOne({ where: { email } });
		if (emailTaken) {
			throw new EmailTakenException();
		}

		let userRoles: any[] = [];
		for (let i in roles) {
			const role: Role = await this.rolesService.getByName(roles[i]);
			if (role) {
				userRoles.push(role);
			}
		}

		const user: User = this.usersRepository.create({
			username: username,
			password: await argon2.hash(password),
			email: email,
			avatar: avatar,
			name: name,
			surname: surname,
			birthdate: birthdate,
			roles: userRoles,
		});

		return this.usersRepository.save(user);
	}

	/**
	 * Get all the users.
	 */
	public async getAll(): Promise<User[]> {
		return await this.usersRepository.find({ relations: ['roles'] });
	}

	/**
	 * Get all the not verified users.
	 * Roles relation is not returned.
	 */
	public async getNotVerified(): Promise<User[]> {
		return await this.usersRepository.createQueryBuilder('user').select('*').where('verified = false').execute();
	}

	/**
	 * Get a user by id.
	 */
	public async getById(id: number): Promise<User> {
		const user: User = await this.usersRepository.findOne({ where: { id: id }, relations: ['roles'] });
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Get a user by username.
	 */
	public async getByUsername(username: string): Promise<User> {
		const user: User = await this.usersRepository.findOne({ where: { username }, relations: ['roles'] });
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Get a user by email.
	 */
	public async getByEmail(email: string): Promise<User> {
		const user: User = await this.usersRepository.findOne({ where: { email }, relations: ['roles'] });
		if (!user) {
			throw new UserNotFoundException();
		}

		return user;
	}

	/**
	 * Get the user's avatar.
	 */
	public async getAvatarById(id: number): Promise<string> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		return user.avatar;
	}

	/**
	 * Get the user's avatar.
	 */
	public async getAvatarByUsername(username: string): Promise<string> {
		const user: User = await this.getByUsername(username);
		if (!user) {
			throw new UserNotFoundException();
		}

		return user.avatar;
	}

	/**
	 * Update the user.
	 */
	public async update(
		id: number,
		username: string,
		password: string,
		avatar: string,
		name: string,
		surname: string,
		birthdate: Date,
	): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		if (username) {
			await this.updateUsername(id, username);
		}

		if (password) {
			await this.updatePassword(id, password);
		}

		user.avatar = avatar || user.avatar;
		user.name = name || user.name;
		user.surname = surname || user.surname;
		user.birthdate = birthdate || user.birthdate;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's username.
	 */
	public async updateUsername(id: number, username: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		const usernameTaken: User = await this.getByUsername(username);
		if (usernameTaken) {
			throw new UsernameTakenException();
		}

		user.username = username;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's username if the password is verified.
	 */
	public async updateUsernameSecure(id: number, username: string, password: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		const valid: boolean = await argon2.verify(user.password, password);
		if (!valid) {
			throw new InvalidCredentialsException();
		}

		const usernameTaken: User = await this.getByUsername(username);
		if (usernameTaken) {
			throw new UsernameTakenException();
		}

		user.username = username;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's email.
	 */
	public async updateEmail(id: number, email: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.email = email;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's password.
	 */
	public async updatePassword(id: number, password: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.password = await argon2.hash(password);

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's password if the password is verified.
	 */
	public async updatePasswordSecure(id: number, currentPassword: string, newPassword: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		const valid: boolean = await argon2.verify(user.password, currentPassword);
		if (!valid) {
			throw new InvalidCredentialsException();
		}

		user.password = await argon2.hash(newPassword);

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's avatar.
	 */
	public async updateAvatar(id: number, avatar: string = ''): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.avatar = avatar;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's name.
	 */
	public async updateName(id: number, name: string = ''): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.name = name;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's surname.
	 */
	public async updateSurname(id: number, surname: string = ''): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.surname = surname;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's birthdate.
	 */
	public async updateBirthdate(id: number, birthdate: Date = new Date('1900-01-01')): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.birthdate = birthdate;

		return await this.usersRepository.save(user);
	}

	/**
	 * Update the user's verified field.
	 */
	public async updateVerified(id: number, verified: boolean): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		user.verified = verified;

		return await this.usersRepository.save(user);
	}

	/**
	 * Delete the user.
	 */
	public async delete(id: number): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		return await this.usersRepository.remove(user);
	}

	/**
	 * Delete the user if the password is verified.
	 */
	public async deleteSecure(id: number, password: string): Promise<User> {
		const user: User = await this.getById(id);
		if (!user) {
			throw new UserNotFoundException();
		}

		const valid: boolean = await argon2.verify(user.password, password);
		if (!valid) {
			throw new InvalidCredentialsException();
		}

		return await this.usersRepository.remove(user);
	}

	/**
	 * Delete the expired not verified users.
	 */
	@Cron('0 1 * * * *') // Every hour, at the start of the 1st minute.
	public async deleteExpiredNotVerifiedUsers() {
		this.cronLogger.log('Delete expired not verified users');

		const now: Date = new Date();
		const expirationTime: any = this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME');

		const users: User[] = await this.getNotVerified();
		for (let i = 0; i < users.length; i++) {
			const user: User = users[i];
			const createDate: Date = new Date(user.createdate);
			const expirationDate: Date = new Date(createDate.getTime() + ms(expirationTime));

			if (now > expirationDate) {
				try {
					this.delete(user.id);
					this.cronLogger.log('User ' + user.username + ' deleted');
				} catch (error: any) {
					// Ignore user not found.
				}
			}
		}
	}

	/**
	 * Populate the database with dummy users.
	 */
	public async populateDummyUsers() {
		fs.readFile('./users.json', 'utf8', (error, data) => {
			if (error) {
				return;
			}

			const users: any = JSON.parse(data);
			users.records.forEach(async (record) => {
				try {
					const user: User = await this.create(
						record.username,
						record.password,
						record.email,
						record.avatar,
						record.name,
						record.surname,
						record.birthdate,
						record.roles,
					);

					await this.updateVerified(user.id, true);
				} catch (error: any) {
					// Ignore user already created.
				}
			});
		});
	}
}
