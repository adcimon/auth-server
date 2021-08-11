import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenException extends HttpException
{
    constructor()
    {
        super({ errorCode: 101, statusCode: HttpStatus.CONFLICT, message: 'Email is already being used' }, HttpStatus.CONFLICT);
    }
}