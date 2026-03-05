import { Catch, HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { ErrorDto } from '../dtos/error.dto';
import { GenericErrorException } from './generic-error.exception';
import { UnauthorizedException } from './unauthorized.exception';
import { ForbiddenException } from './forbidden.exception';
import { InvalidRequestException } from './invalid-request.exception';
const packageJson = require('../../package.json');

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();

		return this.handleException(request, response, exception);
	}

	private getStatus(exception: any): number {
		if (exception && typeof exception.getStatus === 'function') {
			return exception.getStatus();
		}

		if (exception?.['$metadata']?.httpStatusCode) {
			return exception['$metadata'].httpStatusCode;
		}

		return HttpStatus.INTERNAL_SERVER_ERROR;
	}

	private isUnmanaged(exception: any): boolean {
		if (!(exception instanceof HttpException)) {
			return true;
		}

		if (!(exception.getResponse() instanceof ErrorDto)) {
			return true;
		}

		return false;
	}

	private handleException(request: Request, response: Response, exception: any) {
		if (this.isUnmanaged(exception)) {
			const status: number = this.getStatus(exception);
			switch (status) {
				case HttpStatus.UNAUTHORIZED:
					exception = new UnauthorizedException(exception?.message);
					break;
				case HttpStatus.FORBIDDEN:
					exception = new ForbiddenException(exception?.message);
					break;
				case HttpStatus.NOT_FOUND:
					exception = new InvalidRequestException(exception?.message);
					break;
				default:
					exception = new GenericErrorException(exception?.message);
					break;
			}
		}

		const body = {
			version: packageJson.version,
			endpoint: `${request.protocol}://${request.get('host')}${request.originalUrl}`,
			timestamp: new Date().toISOString(),
			error: exception.getResponse(),
		};

		return response.status(exception.getStatus()).json(body);
	}
}
