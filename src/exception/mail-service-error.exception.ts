import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class MailServiceErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 112;
		error.message = message || 'Mail service error';
		super(error, HttpStatus.SERVICE_UNAVAILABLE);
	}
}