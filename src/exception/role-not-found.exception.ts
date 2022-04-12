import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleNotFoundException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 109,
            status: HttpStatus.NOT_FOUND,
            message: 'Role not found'
        }, HttpStatus.NOT_FOUND);
    }
}