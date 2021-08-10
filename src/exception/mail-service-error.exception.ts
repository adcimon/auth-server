import { HttpException, HttpStatus } from '@nestjs/common';

export class MailServiceErrorException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.SERVICE_UNAVAILABLE, message: 'Mail service error' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}