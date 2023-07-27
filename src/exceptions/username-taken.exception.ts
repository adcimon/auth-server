import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class UsernameTakenException extends HttpException {
	constructor(username?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'username_taken';
		error.message = 'Username is already being used';
		error.data = { username: username };
		super(error, HttpStatus.CONFLICT);
	}
}
