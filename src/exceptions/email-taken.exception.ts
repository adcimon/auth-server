import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class EmailTakenException extends HttpException {
	constructor(email?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'email_taken';
		error.message = 'Email is already being used';
		error.data = { email: email };
		super(error, HttpStatus.CONFLICT);
	}
}
