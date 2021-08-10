import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid password' }, HttpStatus.UNAUTHORIZED);
    }
}