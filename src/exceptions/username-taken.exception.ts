import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class UsernameTakenException extends HttpException
{
	constructor( username?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'username_taken';
		error.message = 'Username is already being used';
		error.data = { username: username };
		super(error, HttpStatus.CONFLICT);
	}
}