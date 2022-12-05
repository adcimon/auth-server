import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 107,
            message: 'Invalid password'
        }, HttpStatus.UNAUTHORIZED);
    }
}