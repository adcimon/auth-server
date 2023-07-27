import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class EmailNotVerifiedException extends HttpException {
	constructor(email?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'email_not_verified';
		error.message = 'Email not verified';
		error.data = { email: email };
		super(error, HttpStatus.UNAUTHORIZED);
	}
}
