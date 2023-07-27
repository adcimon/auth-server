import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorDto } from '../dtos/error.dto';

export class RoleNotFoundException extends HttpException {
	constructor(role?: string) {
		const error: ErrorDto = new ErrorDto();
		error.code = 'role_not_found';
		error.message = 'Role not found';
		error.data = { role: role };
		super(error, HttpStatus.NOT_FOUND);
	}
}
