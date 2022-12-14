import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class UsernameTakenException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 105;
		error.message = message || 'Username is already being used';
		super(error, HttpStatus.CONFLICT);
	}
}