import { HttpException, HttpStatus } from '@nestjs/common';

export class MailServiceErrorException extends HttpException
{
    constructor()
    {
        super({ errorCode: 106, statusCode: HttpStatus.SERVICE_UNAVAILABLE, message: 'Mail service error' }, HttpStatus.SERVICE_UNAVAILABLE);
    }
}