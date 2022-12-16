import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class ValidationErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'validation_error';
		error.message = message || 'Validation error';
		super(error, HttpStatus.BAD_REQUEST);
	}
}