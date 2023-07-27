import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class UserNotFoundException extends HttpException {
	constructor(user?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'user_not_found';
		error.message = 'User not found';
		error.data = { user: user };
		super(error, HttpStatus.NOT_FOUND);
	}
}
