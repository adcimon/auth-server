import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class EmailTakenException extends HttpException
{
	constructor( email?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'email_taken';
		error.message = 'Email is already being used';
		error.data = { email: email };
		super(error, HttpStatus.CONFLICT);
	}
}