import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class PasswordInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
		const request: any = context.switchToHttp().getRequest();

		if (request.body && request.body.password) {
			request.body.password = Buffer.from(request.body.password, 'base64').toString('utf-8');
		}

		if (request.body && request.body.currentPassword) {
			request.body.currentPassword = Buffer.from(request.body.currentPassword, 'base64').toString('utf-8');
		}

		if (request.body && request.body.newPassword) {
			request.body.newPassword = Buffer.from(request.body.newPassword, 'base64').toString('utf-8');
		}

		return handler.handle().pipe(
			map((data) => {
				return data;
			}),
		);
	}
}
