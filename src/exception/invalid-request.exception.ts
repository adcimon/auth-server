import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class InvalidRequestException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 102;
		error.message = message || 'Invalid request';
		super(error, HttpStatus.NOT_FOUND);
	}
}