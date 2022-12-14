import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class ForbiddenErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 103;
		error.message = message || 'Forbidden';
		super(error, HttpStatus.FORBIDDEN);
	}
}