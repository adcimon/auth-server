import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class EmailNotVerifiedException extends HttpException
{
	constructor( email?: string )
	{
		const error : BackendError = new BackendError();
		error.code = 'email_not_verified';
		error.message = 'Email not verified';
		error.data = { email: email };
		super(error, HttpStatus.UNAUTHORIZED);
	}
}