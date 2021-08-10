import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Invalid token' }, HttpStatus.UNAUTHORIZED);
    }
}