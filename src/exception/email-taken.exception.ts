import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class EmailTakenException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 106;
		error.message = message || 'Email is already being used';
		super(error, HttpStatus.CONFLICT);
	}
}