import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
const packageJson = require('../../package.json');

export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		return handler.handle().pipe(
			map((data) => {
				const request: any = context.switchToHttp().getRequest();

				const body: any = {};
				body.version = packageJson.version;
				body.endpoint = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
				body.timestamp = new Date().toISOString();
				body.data = data;

				return body;
			}),
		);
	}
}
