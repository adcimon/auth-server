import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class InvalidTokenException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'invalid_token';
		error.message = message || 'Invalid token';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}
