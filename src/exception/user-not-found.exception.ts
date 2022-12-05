import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException
{
    constructor()
    {
        super(
        {
            error: 110,
            message: 'User not found'
        }, HttpStatus.NOT_FOUND);
    }
}