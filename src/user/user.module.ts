import { Module } from '@nestjs/common';
import { User } from './user.entity';

// Imports.
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers.
import { UserController } from './user.controller';

// Providers.
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }