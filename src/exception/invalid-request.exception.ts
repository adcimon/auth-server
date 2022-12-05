import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRequestException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 101,
            message: 'Invalid request'
        }, HttpStatus.NOT_FOUND);
    }
}