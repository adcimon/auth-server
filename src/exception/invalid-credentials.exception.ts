import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class InvalidCredentialsException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 108;
		error.message = message || 'Invalid credentials';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}