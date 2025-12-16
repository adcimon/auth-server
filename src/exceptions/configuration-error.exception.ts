import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class ConfigurationErrorException extends HttpException {
	constructor(message?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'configuration_error';
		error.message = message || 'Configuration error';
		super(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
