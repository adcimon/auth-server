import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class UserService implements OnModuleInit
{
    private readonly cronLogger = new Logger("CRON");

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit()
    {
        if( !this.configService.isProduction() )
        {
            await this.populateDummyUsers();
        }
    }

    /**
     * Create a user.
     */
    async create(
        username:   string,
        password:   string,
        email:      string,
        avatar:     string,
        name:       string,
        surname:    string,
        birthdate:  Date,
        role:       number
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
            username:   username,
            password:   await argon2.hash(password),
            email:      email,
            avatar:     avatar,
            name:       name,
            surname:    surname,
            birthdate:  birthdate,
            role:       role
        });

        return this.usersRepository.save(user);
    }

    /**
     * Get all the users.
     */
    async getAll(): Promise<User[]>
    {
        return await this.usersRepository.find();
    }

    /**
     * Get all the not verified users.
     */
    async getNotVerified(): Promise<User[]>
    {
        return await this.usersRepository.createQueryBuilder("user").select("*").where("verified = false").execute();
    }

    /**
     * Get a user by id.
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
     * Get the user's avatar.
     */
    async getAvatar(
        username: string
    ): Promise<string>
    {
        const user = await this.getByUsername(username);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        return user.avatar;
    }

    /**
     * Update the user.
     */
    async update(
        id:         number,
        username:   string,
        password:   string,
        avatar:     string,
        name:       string,
        surname:    string,
        birthdate:  Date,
        role:       number,
        verified:   boolean
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        if( username )
        {
            this.updateUsername(id, username);
        }

        if( password )
        {
            this.updatePassword(id, password);
        }

        user.avatar = avatar || user.avatar;
        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.birthdate = birthdate || user.birthdate;
        user.role = role || user.role;
        user.verified = verified || user.verified;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's username.
     */
    async updateUsername(
        id:         number,
        username:   string
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
     */
    async updateUsernameSecure(
        id:         number,
        username:   string,
        password:   string
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
     */
    async updatePassword(
        id:         number,
        password:   string
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
     */
    async updatePasswordSecure(
        id:                 number,
        currentPassword:    string,
        newPassword:        string
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
     */
    async updateAvatar(
        id:         number,
        avatar:     string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.avatar = avatar || user.avatar;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's name.
     */
    async updateName(
        id:     number,
        name:   string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.name = name || user.name;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's surname.
     */
    async updateSurname(
        id:         number,
        surname:    string
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.surname = surname || user.surname;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's birthdate.
     */
    async updateBirthdate(
        id:         number,
        birthdate:  Date
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.birthdate = birthdate || user.birthdate;

        return this.usersRepository.save(user);
    }

    /**
     * Update the user's verified field.
     */
    async updateVerified(
        id:         number,
        verified:   boolean
    ): Promise<User>
    {
        const user = await this.getById(id);
        if( !user )
        {
            throw new UserNotFoundException();
        }

        user.verified = verified || user.verified;

        return this.usersRepository.save(user);
    }

    /**
     * Delete the user.
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
     */
    async deleteSecure(
        id:         number,
        password:   string
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
     * Delete the expired not verified users.
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

    /**
     * Populate the database with dummy users.
     */
    async populateDummyUsers()
    {
        // The Fellowship of the Ring.

        // Frodo.
        try {
            let frodo = await this.create(
                'Frodo',
                'frodo9000',
                'frodo@fellowship.lotr',
                '',
                'Frodo',
                'Baggins',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(frodo.id, true);
        } catch( exception ) { }

        // Sam.
        try {
            let sam = await this.create(
                'Sam',
                'sam9000',
                'sam@fellowship.lotr',
                '',
                'Samwise',
                'Gamgee',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(sam.id, true);
        } catch( exception ) { }

        // Merry.
        try {
            let merry = await this.create(
                'Merry',
                'merry9000',
                'merry@fellowship.lotr',
                '',
                'Meriadoc',
                'Brandigamo',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(merry.id, true);
        } catch( exception ) { }

        // Pippin.
        try {
            let pippin = await this.create(
                'Pippin',
                'pippin9000',
                'pippin@fellowship.lotr',
                '',
                'Peregrin',
                'Took',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(pippin.id, true);
        } catch( exception ) { }

        // Gandalf.
        try {
            let gandalf = await this.create(
                'Gandalf',
                'gandalf9000',
                'gandalf@fellowship.lotr',
                '',
                'Gandalf',
                'The Grey',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(gandalf.id, true);
        } catch( exception ) { }

        // Aragorn.
        try {
            let aragorn = await this.create(
                'Aragorn',
                'aragorn9000',
                'aragorn@fellowship.lotr',
                '',
                'Aragorn',
                '',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(aragorn.id, true);
        } catch( exception ) { }

        // Legolas.
        try {
            let legolas = await this.create(
                'Legolas',
                'legolas9000',
                'legolas@fellowship.lotr',
                '',
                'Legolas',
                '',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(legolas.id, true);
        } catch( exception ) { }

        // Gimli.
        try {
            let gimli = await this.create(
                'Gimli',
                'gimli9000',
                'gimli@fellowship.lotr',
                '',
                'Gimli',
                '',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(gimli.id, true);
        } catch( exception ) { }

        // Boromir.
        try {
            let boromir = await this.create(
                'Boromir',
                'boromir9000',
                'boromir@fellowship.lotr',
                '',
                'Boromir',
                '',
                new Date('2001-12-10'),
                0
            );
            await this.updateVerified(boromir.id, true);
        } catch( exception ) { }
    }
}