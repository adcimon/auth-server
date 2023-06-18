import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class InvalidRequestException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'invalid_request';
		error.message = message || 'Invalid request';
		super(error, HttpStatus.BAD_REQUEST);
	}
}