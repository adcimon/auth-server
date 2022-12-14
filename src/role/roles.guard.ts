import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/user.entity';
import { UsersService } from '../user/users.service';
import { RoleEnum } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate
{
	constructor(
		private reflector: Reflector,
		private readonly userService: UsersService,
	) { }

	async canActivate( context: ExecutionContext ): Promise<boolean>
	{
		const requiredRoles: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>('roles',
		[
			context.getHandler(),
			context.getClass()
		]);

		if( !requiredRoles )
		{
			return true;
		}

		const request: any = context.switchToHttp().getRequest();
		if( !request.user )
		{
			return false;
		}

		const user: User = await this.userService.getByUsername(request.user.username);
		const roleNames: string[] = user.roles.map(r => r.name);
		const activate: boolean = requiredRoles.some(role => roleNames.includes(role))

		return activate;
	}
}