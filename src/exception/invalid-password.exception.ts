import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 107,
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid password'
        }, HttpStatus.UNAUTHORIZED);
    }
}