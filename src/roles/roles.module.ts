import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Role]),
		forwardRef(() => UsersModule), // Circular dependency resolved.
	],
	controllers: [],
	providers: [RolesService],
	exports: [RolesService],
})
export class RolesModule {}
