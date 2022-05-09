import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Module(
{
    imports:
    [
        // * Role ORM module.
        TypeOrmModule.forFeature([Role]),

        // * User module.
        // Circular dependency resolved.
        forwardRef(() => UserModule)
    ],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule
{
}