import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { UsernameTakenException } from '../exception/username-taken.exception';
import { EmailTakenException } from '../exception/email-taken.exception';
import { UserNotFoundException } from '../exception/user-not-found.exception';
import { InvalidPasswordException } from '../exception/invalid-password.exception';
import * as argon2 from 'argon2';
import * as ms from 'ms';

@Injectable()
export class UserService
{
    private readonly cronLogger = new Logger("CRON");

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Get all the users.
     * @returns User[]
     */
    async getAll(): Promise<User[]>
    {
        return await this.usersRepository.find();
    }

    /**
     * Get all the not verified users.
     * @returns User[]
     */
    async getNotVerified(): Promise<User[]>
    {
        return await this.usersRepository.createQueryBuilder("user").select("*").where("verified = false").execute();
    }

    /**
     * Get a user by id.
     * @param id
     * @returns User
     */
    async getById(
        id: number
    ): Promise<User>
    {
        const user = await this.usersRepository.findOne(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user;
    }

    /**
     * Get a user by username.
     * @param username
     * @returns User
     */
    async getByUsername(
        username: string
    ): Promise<User>
    {
        const user = this.usersRepository.findOne({ where: { username } });
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user;
    }

    /**
     * Get a user by email.
     * @param email
     * @returns User
     */
    async getByEmail(
        email: string
    ): Promise<User>
    {
        const user = this.usersRepository.findOne({ where: { email } });
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user;
    }

    /**
     * Create a user.
     * @param username
     * @param password
     * @param email
     * @param name
     * @param surname
     * @param birthdate
     * @returns User
     */
    async create(
        username: string,
        password: string,
        email: string,
        name: string,
        surname: string,
        birthdate: Date
    ): Promise<User>
    {
        const usernameTaken = await this.usersRepository.findOne({ where: { username } });
        if( usernameTaken )
        {
            throw new UsernameTakenException();
        }

        const emailTaken = await this.usersRepository.findOne({ where: { email } });
        if( emailTaken )
        {
            throw new EmailTakenException();
        }

        const user = this.usersRepository.create({
            username: username,
            password: await argon2.hash(password),
            email: email,
            name: name,
            surname: surname,
            birthdate: birthdate
        });

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's username.
     * @param id
     * @param username
     * @returns User
     */
    async updateUsername(
        id: number,
        username: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        const usernameTaken = await this.getByUsername(username);
        if( usernameTaken )
        {
            throw new UsernameTakenException();
        }

        user.username = username;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's username if the password is verified.
     * @param id
     * @param username
     * @param password
     * @returns User
     */
    async updateUsernameSecure(
        id: number,
        username: string,
        password: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        const valid = await argon2.verify(user.password, password);
        if( !valid )
        {
            throw new InvalidPasswordException();
        }

        const usernameTaken = await this.getByUsername(username);
        if( usernameTaken )
        {
            throw new UsernameTakenException();
        }

        user.username = username;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's password.
     * @param id
     * @param password
     * @returns User
     */
    async updatePassword(
        id: number,
        password: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.password = await argon2.hash(password);

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's password if the password is verified.
     * @param id
     * @param currentPassword
     * @param newPassword
     * @returns User
     */
    async updatePasswordSecure(
        id: number,
        currentPassword: string,
        newPassword: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        const valid = await argon2.verify(user.password, currentPassword);
        if( !valid )
        {
            throw new InvalidPasswordException();
        }

        user.password = await argon2.hash(newPassword);

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's avatar.
     * @param id
     * @param avatar
     */
    async updateAvatar(
        id: number,
        avatar: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        if( avatar )
        {
            user.avatar = avatar;
        }
        else
        {
            user.avatar = '';
        }

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's name.
     * @param id
     * @param name
     * @returns User
     */
    async updateName(
        id: number,
        name: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        if( name )
        {
            user.name = name;
        }
        else
        {
            user.name = '';
        }

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's surname.
     * @param id
     * @param surname
     * @returns User
     */
    async updateSurname(
        id: number,
        surname: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        if( surname )
        {
            user.surname = surname;
        }
        else
        {
            user.surname = '';
        }

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's birthdate.
     * @param id
     * @param birthdate
     * @returns User
     */
    async updateBirthdate(
        id: number,
        birthdate: Date
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        if( birthdate )
        {
            user.birthdate = birthdate;
        }

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's verified field.
     * @param id
     * @param verified
     */
    async updateVerified(
        id: number,
        verified: boolean
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.verified = verified;

        return this.usersRepository.save(user);
    }

    /**
     * Delete the user.
     * @param id
     * @returns User
     */
    async delete(
        id: number
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return this.usersRepository.remove(user);
    }

    /**
     * Delete the user if the password is verified.
     * @param id
     * @param password
     * @returns User
     */
    async deleteSecure(
        id: number,
        password: string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        const valid = await argon2.verify(user.password, password);
        if( !valid )
        {
            throw new InvalidPasswordException();
        }

        return this.usersRepository.remove(user);
    }

    /**
     * Deletes the expired not verified users.
     */
    @Cron('0 1 * * * *') // Every hour, at the start of the 1st minute.
    async deleteExpiredNotVerifiedUsers()
    {
        this.cronLogger.log('Delete expired not verified users');

        const now = new Date();
        const expirationTime = this.configService.get('TOKEN_VERIFICATION_EXPIRATION_TIME');

        const users = await this.getNotVerified();
        for( let i = 0; i < users.length; i++ )
        {
            const user = users[i];
            const createDate = new Date(user.createdate);
            const expirationDate = new Date(createDate.getTime() + ms(expirationTime));

            if( now > expirationDate )
            {
                try
                {
                    this.delete(user.id);
                    this.cronLogger.log('User ' + user.username + ' deleted');
                }
                catch( exception )
                {
                }
            }
        }
    }
}