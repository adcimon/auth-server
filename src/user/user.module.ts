import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module(
{
    imports:
    [
        // * Config module.
        ConfigModule,

        // * User ORM module.
        TypeOrmModule.forFeature([User]),

        // * Role module.
        // Circular dependency resolved.
        forwardRef(() => RoleModule),

        // * Auth module.
        // Circular dependency resolved.
        forwardRef(() => AuthModule),

        // * Mail module.
        MailModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule
{
}