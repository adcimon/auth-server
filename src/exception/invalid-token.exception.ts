import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class InvalidTokenException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 109;
		error.message = message || 'Invalid token';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}