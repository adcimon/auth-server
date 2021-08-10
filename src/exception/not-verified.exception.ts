import { HttpException, HttpStatus } from '@nestjs/common';

export class NotVerifiedException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.UNAUTHORIZED, message: 'Email not verified' }, HttpStatus.UNAUTHORIZED);
    }
}