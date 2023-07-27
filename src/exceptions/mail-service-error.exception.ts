import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class MailServiceErrorException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'mail_service_error';
		error.message = message || 'Mail service error';
		super(error, HttpStatus.SERVICE_UNAVAILABLE);
	}
}
