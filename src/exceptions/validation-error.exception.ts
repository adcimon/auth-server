import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class ValidationErrorException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'validation_error';
		error.message = message || 'Validation error';
		super(error, HttpStatus.BAD_REQUEST);
	}
}
