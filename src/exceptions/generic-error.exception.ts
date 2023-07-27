import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class GenericErrorException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'generic_error';
		error.message = message || 'Generic error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
