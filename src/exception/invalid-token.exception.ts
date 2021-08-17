import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 107,
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid token'
        }, HttpStatus.UNAUTHORIZED);
    }
}