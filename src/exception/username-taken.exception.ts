import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameTakenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 104,
            message: 'Username is already being used'
        }, HttpStatus.CONFLICT);
    }
}