import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ValidationErrorException } from '../exceptions/validation-error.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
	constructor(private readonly schema: any) {}

	async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		try {
			await this.schema.validate(value, { abortEarly: false });
			return value;
		} catch (error: any) {
			const message: any = error.errors.length === 0 ? 'Validation error' : error.errors[0];
			throw new ValidationErrorException(message);
		}
	}
}
