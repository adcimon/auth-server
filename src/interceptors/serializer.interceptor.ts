import { CallHandler, ClassSerializerInterceptor, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SerializerInterceptor extends ClassSerializerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();

		// Pass oauth routes.
		if (request.path.startsWith('/oauth')) {
			return next.handle();
		}

		return super.intercept(context, next);
	}
}
