import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenResourceException extends HttpException
{
    constructor( message?: string )
    {
        super(
        {
            error: 103,
            message: message || 'Forbidden resource'
        }, HttpStatus.FORBIDDEN);
    }
}