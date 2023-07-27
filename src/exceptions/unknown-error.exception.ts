import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class UnknownErrorException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'unknown_error';
		error.message = message || 'Unknown error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
