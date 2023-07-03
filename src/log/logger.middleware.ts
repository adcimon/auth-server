import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const WHITE_COLOR: string = '\x1b[0m';
const RED_COLOR: string = '\x1b[31m';
const GREEN_COLOR: string = '\x1b[32m';
const YELLOW_COLOR: string = '\x1b[33m';
const CYAN_COLOR: string = '\x1b[36m';

const BASE_COLOR: string = WHITE_COLOR;
const GET_COLOR: string = CYAN_COLOR;
const POST_COLOR: string = GREEN_COLOR;
const PATCH_COLOR: string = YELLOW_COLOR;
const PUT_COLOR: string = YELLOW_COLOR;
const DELETE_COLOR: string = RED_COLOR;

const METHOD_TAG = ( method: string, url: string ): string =>
{
	let color: string = BASE_COLOR;
	switch( method )
	{
		case 'POST':
			color = POST_COLOR;
			break;
		case 'GET':
			color = GET_COLOR;
			break;
		case 'PUT':
			color = PUT_COLOR;
			break;
		case 'PATCH':
			color = PATCH_COLOR;
			break;
		case 'DELETE':
			color = DELETE_COLOR;
			break;
	}

	return `${color}${method} ${url}${BASE_COLOR}`;
};

const STATUS_TAG = ( code: number ): string =>
{
	let color = GREEN_COLOR;
	if( code >= 400 )
	{
		color = RED_COLOR;
	}

	return `${color}${code}${BASE_COLOR}`;
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware
{
	private logger: Logger = new Logger('API');

	use( request: Request, response: Response, next: NextFunction )
	{
		const ip: any = request.ip;
		const method: any = request.method;
		const originalUrl: any = request.originalUrl;
		const userAgent: any = request.get('user-agent') || '';

		response.on('finish', () =>
		{
			const statusCode: number = response.statusCode;

			let message: string = METHOD_TAG(method, originalUrl);
			message += ` (${STATUS_TAG(statusCode)})`;
			message += ` <${ip}> <${userAgent}>`;
			this.logger.log(message);

			if( Object.keys(request.body).length !== 0 )
			{
				this.logger.log(`${BASE_COLOR}${JSON.stringify(request.body)}`);
			}
		});

		next();
	}
}