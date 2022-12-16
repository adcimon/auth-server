import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class EmailNotVerifiedException extends HttpException
{
	constructor( email?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'email_not_verified';
		error.message = 'Email not verified';
		error.data = { email: email };
		super(error, HttpStatus.UNAUTHORIZED);
	}
}