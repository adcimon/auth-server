import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class InvalidCredentialsException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'invalid_credentials';
		error.message = message || 'Invalid credentials';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}
