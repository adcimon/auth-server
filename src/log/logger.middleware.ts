import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogUtils } from '../utils/log.utils';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger: Logger = new Logger('API');

	use(request: Request, response: Response, next: NextFunction) {
		const ip: any = request.ip;
		const method: any = request.method;
		const originalUrl: any = request.originalUrl;
		const userAgent: any = request.get('user-agent') || '';

		response.on('finish', () => {
			const statusCode: number = response.statusCode;

			const message: string = LogUtils.log(method, originalUrl, statusCode, `<${ip}> <${userAgent}>`);
			this.logger.log(message);

			if (Object.keys(request.body).length !== 0) {
				const body: any = { ...request.body };
				delete body.password;
				delete body.currentPassword;
				delete body.newPassword;

				this.logger.log(`${LogUtils.BASE_COLOR}${JSON.stringify(body)}`);
			}
		});

		next();
	}
}
