import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class ResponseInterceptor implements NestInterceptor
{
	intercept( context: ExecutionContext, handler: CallHandler ): Observable<any>
	{
		return handler.handle().pipe(map(data =>
		{
			const request: any = context.switchToHttp().getRequest();

			data.url = request.url;
			data.timestamp = (new Date()).toISOString();
	
			return data;
		}));
	}
}