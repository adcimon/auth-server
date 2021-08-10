import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameTakenException extends HttpException
{
    constructor()
    {
        super({ statusCode: HttpStatus.CONFLICT, message: 'Username is already being used' }, HttpStatus.CONFLICT);
    }
}