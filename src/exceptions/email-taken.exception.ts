import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class EmailTakenException extends HttpException {
	constructor(email?: string) {
		const error: BackendError = new BackendError();
		error.code = 'email_taken';
		error.message = 'Email is already being used';
		error.data = { email: email };
		super(error, HttpStatus.CONFLICT);
	}
}
