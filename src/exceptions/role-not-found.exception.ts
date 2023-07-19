import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error';

export class RoleNotFoundException extends HttpException {
	constructor(role?: string) {
		const error: BackendError = new BackendError();
		error.code = 'role_not_found';
		error.message = 'Role not found';
		error.data = { role: role };
		super(error, HttpStatus.NOT_FOUND);
	}
}
