import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class GenericErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.code = 'generic_error';
		error.message = message || 'Generic error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}