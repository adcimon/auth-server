import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware
{
	private logger = new Logger('HTTP');

	use( request: Request, response: Response, next: NextFunction )
	{
		const ip: string = request.ip;
		const method: string = request.method;
		const originalUrl: string = request.originalUrl;
		const userAgent: string = request.get('user-agent') || '';

		const normalColor: string = '\x1b[0m';

		let methodColor: string = '\x1b[0m';
		switch( method )
		{
			case 'POST':
				methodColor = '\x1b[32m';
				break;
			case 'GET':
				methodColor = '\x1b[36m';
				break;
			case 'PUT':
			case 'PATCH':
				methodColor = '\x1b[33m';
				break;
			case 'DELETE':
				methodColor = '\x1b[31m';
				break;
		}

		response.on('finish', () =>
		{
			const statusCode: number = response.statusCode;

			let statusColor: string = '\x1b[32m';
			if( statusCode >= 400 )
			{
				statusColor = '\x1b[31m';
			}

			let message: string = `${methodColor}${method} ${originalUrl}`;
			message += ` ${normalColor}(${statusColor}${statusCode}${normalColor})`;
			message += ` <${ip}> <${userAgent}>`;
			this.logger.log(message);

			if( Object.keys(request.body).length !== 0 )
			{
				this.logger.log(`${normalColor}${JSON.stringify(request.body)}`);
			}
		});

		next();
	}
}