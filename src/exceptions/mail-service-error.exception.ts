import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class MailServiceErrorException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 'mail_service_error';
		error.message = message || 'Mail service error';
		super(error, HttpStatus.SERVICE_UNAVAILABLE);
	}
}