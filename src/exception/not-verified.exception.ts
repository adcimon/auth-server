import { HttpException, HttpStatus } from '@nestjs/common';

export class NotVerifiedException extends HttpException
{
    constructor()
    {
        super({ errorCode: 103, statusCode: HttpStatus.UNAUTHORIZED, message: 'Email not verified' }, HttpStatus.UNAUTHORIZED);
    }
}