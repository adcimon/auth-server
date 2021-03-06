import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { RoleEnum } from './role.enum';
import { RoleNotFoundException } from '../exception/role-not-found.exception';

@Injectable()
export class RoleService implements OnModuleInit
{
    constructor(
        @InjectRepository(Role) private rolesRepository: Repository<Role>
    ) { }

    async onModuleInit()
    {
        await this.populateRoles();
    }

    /**
     * Populate the database with the roles defined in the role enum.
     */
    async populateRoles()
    {
        for( const key in RoleEnum )
        {
            const name = RoleEnum[key];

            try
            {
                let role = await this.rolesRepository.findOne({ where: { name } });
                if( role )
                {
                    continue;
                }

                role = this.rolesRepository.create(
                {
                    name: name
                });

                this.rolesRepository.save(role);
            }
            catch( exception )
            {
                // Catch role already created.
            }
        }
    }

    /**
     * Get all the roles.
     */
    async getAll(): Promise<Role[]>
    {
        return await this.rolesRepository.find();
    }

    /**
     * Get a role by id.
     */
    async getById(
        id: number
    ): Promise<Role>
    {
        const role = await this.rolesRepository.findOne(id);
        if( !role )
        {
            throw new RoleNotFoundException();
        }

        return role;
    }

    /**
     * Get a role by name.
     */
    async getByName(
        name: string
    ): Promise<Role>
    {
        const role = this.rolesRepository.findOne({ where: { name } });
        if( !role )
        {
            throw new RoleNotFoundException();
        }

        return role;
    }
}