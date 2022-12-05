import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 108,
            message: 'Invalid token'
        }, HttpStatus.UNAUTHORIZED);
    }
}