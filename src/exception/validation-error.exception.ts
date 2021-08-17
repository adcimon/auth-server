import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationErrorException extends HttpException
{
    constructor( message?: string )
    {
        super(
        {
            error: 102,
            status: HttpStatus.BAD_REQUEST,
            message: message || 'Validation error'
        }, HttpStatus.BAD_REQUEST);
    }
}