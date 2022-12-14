import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class UserNotFoundException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 111;
		error.message = message || 'User not found';
		super(error, HttpStatus.NOT_FOUND);
	}
}