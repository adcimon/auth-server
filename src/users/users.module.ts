import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([User]),
		forwardRef(() => RolesModule), // Circular dependency resolved.
		forwardRef(() => AuthModule), // Circular dependency resolved.
		MailModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
