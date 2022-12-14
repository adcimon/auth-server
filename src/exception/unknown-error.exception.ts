import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class UnknownErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 101;
		error.message = message || 'Unknown error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}