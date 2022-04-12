import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Module(
{
    imports:
    [
        TypeOrmModule.forFeature([Role]),
        forwardRef(() => UserModule) // Resolve circular dependency.
    ],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule
{
}