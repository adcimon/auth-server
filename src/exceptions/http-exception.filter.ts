import { Catch, HttpException, HttpStatus, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BackendError } from './backend-error.class';
import { UnknownErrorException } from './unknown-error.exception';
import { InvalidRequestException } from './invalid-request.exception';
import { ForbiddenErrorException } from './forbidden-error.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
	// Exception may not be an HttpException.
	catch( exception: HttpException, host: ArgumentsHost )
	{
		const context = host.switchToHttp();
		const request = context.getRequest<Request>();
		const response = context.getResponse<Response>();
		let error = exception.getResponse();

		// Throwed http exception.
		if( exception instanceof HttpException )
		{
			// Throwed unknown http exception.
			if( !(error instanceof BackendError) )
			{
				const status = exception.getStatus();
				switch( status )
				{
					case HttpStatus.NOT_FOUND:
					{
						exception = new InvalidRequestException();
						break;
					}
					case HttpStatus.FORBIDDEN:
					{
						exception = new ForbiddenErrorException();
						break;
					}
					default:
					{
						const message: string = exception.message;
						exception = new UnknownErrorException(message);
						break;
					}
				}

			}
		}
		// Throwed unknown exception.
		else
		{
			const message: string = (exception as Error)?.message;
			exception = new UnknownErrorException(message);
		}

		error['url'] = request.url;
		error['timestamp'] = (new Date()).toISOString();

		response
		.status(exception.getStatus())
		.json(error);
	}
}