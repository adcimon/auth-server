import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class ForbiddenException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'forbidden';
		error.message = message || 'Forbidden';
		super(error, HttpStatus.FORBIDDEN);
	}
}
