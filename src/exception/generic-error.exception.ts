import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericErrorException extends HttpException
{
    constructor( message?: string )
    {
        super(
        {
            error: 100,
            message: message || 'Generic error'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}