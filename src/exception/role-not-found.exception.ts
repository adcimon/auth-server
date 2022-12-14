import { HttpException, HttpStatus } from '@nestjs/common';
import { BackendError } from './backend-error.class';

export class RoleNotFoundException extends HttpException
{
	constructor( message?: string )
	{
		const error : BackendError = new BackendError();
		error.error = 110;
		error.message = message || 'Role not found';
		super(error, HttpStatus.NOT_FOUND);
	}
}