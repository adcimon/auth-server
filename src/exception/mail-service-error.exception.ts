import { HttpException, HttpStatus } from '@nestjs/common';

export class MailServiceErrorException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 109,
            status: HttpStatus.SERVICE_UNAVAILABLE,
            message: 'Mail service error'
        }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}