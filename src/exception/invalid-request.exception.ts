import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRequestException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 101,
            status: HttpStatus.NOT_FOUND,
            message: 'Invalid request'
        }, HttpStatus.NOT_FOUND);
    }
}