import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException
{
    constructor()
    {
        super({ errorCode: 104, statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }, HttpStatus.UNAUTHORIZED);
    }
}