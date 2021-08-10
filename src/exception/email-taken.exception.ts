import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.CONFLICT, message: 'Email is already being used' }, HttpStatus.CONFLICT);
    }
}