import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 108,
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid token'
        }, HttpStatus.UNAUTHORIZED);
    }
}