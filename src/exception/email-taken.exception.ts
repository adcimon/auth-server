import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 105,
            message: 'Email is already being used'
        }, HttpStatus.CONFLICT);
    }
}