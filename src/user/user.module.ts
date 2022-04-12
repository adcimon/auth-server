import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module(
{
    imports:
    [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => RoleModule) // Resolve circular dependency.
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule
{
}