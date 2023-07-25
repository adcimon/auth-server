import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
const packageJson = require('../../package.json');

export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			map((data) => {
				const request: any = context.switchToHttp().getRequest();

				data.version = packageJson.version;
				data.endpoint = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
				data.timestamp = new Date().toISOString();

				return data;
			}),
		);
	}
}
