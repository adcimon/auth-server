import { HttpException, HttpStatus } from '@nestjs/common';

export class MailServiceErrorException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 111,
            message: 'Mail service error'
        }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}