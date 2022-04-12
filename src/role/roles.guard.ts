import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { RoleEnum } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate
{
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService,
    ) { }

    async canActivate( context: ExecutionContext ): Promise<boolean>
    {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>('roles',
        [
            context.getHandler(),
            context.getClass()
        ]);

        if( !requiredRoles )
        {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        if( !request.user )
        {
            return false;
        }

        const user = await this.userService.getByUsername(request.user.username);
        const roleNames = user.roles.map(r => r.name);
        const activate = requiredRoles.some(role => roleNames.includes(role))

        return activate;
    }
}