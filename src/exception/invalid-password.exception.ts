import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException
{
    constructor()
    {
        super({ errorCode: 102, statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid password' }, HttpStatus.UNAUTHORIZED);
    }
}