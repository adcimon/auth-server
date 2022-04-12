import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameTakenException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 104,
            status: HttpStatus.CONFLICT,
            message: 'Username is already being used'
        }, HttpStatus.CONFLICT);
    }
}