import { HttpException, HttpStatus } from '@nestjs/common';

export class NotVerifiedException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 106,
            message: 'Email not verified'
        }, HttpStatus.UNAUTHORIZED);
    }
}