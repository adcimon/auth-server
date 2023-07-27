import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class InvalidRequestException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'invalid_request';
		error.message = message || 'Invalid request';
		super(error, HttpStatus.BAD_REQUEST);
	}
}
