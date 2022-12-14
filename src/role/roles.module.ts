import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../user/users.module';
import { Role } from './role.entity';
import { RolesService } from './roles.service';

@Module(
{
	imports:
	[
		TypeOrmModule.forFeature([Role]),
		forwardRef(() => UsersModule) // Circular dependency resolved.
	],
	controllers: [],
	providers: [RolesService],
	exports: [RolesService]
})
export class RolesModule
{
}