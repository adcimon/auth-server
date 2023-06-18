import { Catch, HttpException, HttpStatus, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BackendError } from './backend-error';
import { GenericErrorException } from './generic-error.exception';
import { UnknownErrorException } from './unknown-error.exception';
import { InvalidRequestException } from './invalid-request.exception';
import { ForbiddenException } from './forbidden.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
	catch( exception: any, host: ArgumentsHost )
	{
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();
		let error: any = { };

		// Http exception.
		if( exception instanceof HttpException )
		{
			error = exception.getResponse();

			// Unknown error.
			if( !(error instanceof BackendError) )
			{
				const status = exception.getStatus();
				switch( status )
				{
					case HttpStatus.FORBIDDEN:
					{
						exception = new ForbiddenException();
						break;
					}
					case HttpStatus.NOT_FOUND:
					{
						exception = new InvalidRequestException();
						break;
					}
					default:
					{
						const message = exception.message;
						exception = new GenericErrorException(message);
						break;
					}
				}

			}
		}
		// Unknown exception.
		else
		{
			exception = new UnknownErrorException(exception?.message);
			error = exception.getResponse();
		}

		error.message = error.message.charAt(0).toUpperCase() + error.message.slice(1);
		error.url = request.url;
		error.timestamp = (new Date()).toISOString();

		response
			.status(exception.getStatus())
			.json(error);
	}
}