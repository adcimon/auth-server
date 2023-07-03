import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class ForbiddenException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.code = 'forbidden';
		error.message = message || 'Forbidden';
		super(error, HttpStatus.FORBIDDEN);
	}
}