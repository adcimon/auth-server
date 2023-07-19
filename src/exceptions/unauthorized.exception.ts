import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class UnauthorizedException extends HttpException {
	constructor(message?: string) {
		const error: BackendError = new BackendError();
		error.code = 'unauthorized';
		error.message = message || 'Unauthorized';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}
