import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 105,
            status: HttpStatus.CONFLICT,
            message: 'Email is already being used'
        }, HttpStatus.CONFLICT);
    }
}