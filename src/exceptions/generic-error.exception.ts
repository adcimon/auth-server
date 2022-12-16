import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class GenericErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'generic_error';
		error.message = message || 'Generic error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}