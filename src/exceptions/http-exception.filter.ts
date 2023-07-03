import { Catch, HttpException, HttpStatus, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BackendError } from './backend-error';
import { GenericErrorException } from './generic-error.exception';
import { UnknownErrorException } from './unknown-error.exception';
import { UnauthorizedException } from './unauthorized.exception';
import { ForbiddenException } from './forbidden.exception';
import { InvalidRequestException } from './invalid-request.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
	catch( exception: any, host: ArgumentsHost )
	{
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();

		// Http exception.
		if( exception instanceof HttpException )
		{
			if( !(exception.getResponse() instanceof BackendError) )
			{
				const status = exception.getStatus();
				switch( status )
				{
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
		}
		// Unknown exception.
		else
		{
			exception = new UnknownErrorException(exception?.message);
		}

		const body =
		{
			url: request.url,
			timestamp: (new Date()).toISOString(),
			error: exception.getResponse()
		};

		response
			.status(exception.getStatus())
			.json(body);
	}
}