import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class UnauthorizedException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'unauthorized';
		error.message = message || 'Unauthorized';
		super(error, HttpStatus.UNAUTHORIZED);
	}
}
