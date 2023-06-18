import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class InvalidCredentialsException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'invalid_credentials';
		error.message = message || 'Invalid credentials';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}