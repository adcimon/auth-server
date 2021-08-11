import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameTakenException extends HttpException
{
    constructor()
    {
        super({ errorCode: 100, statusCode: HttpStatus.CONFLICT, message: 'Username is already being used' }, HttpStatus.CONFLICT);
    }
}