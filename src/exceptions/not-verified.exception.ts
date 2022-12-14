import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class NotVerifiedException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 107;
		error.message = message || 'Email not verified';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}