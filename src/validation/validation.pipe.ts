import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ValidationErrorException } from '../exception/validation-error.exception';

@Injectable()
export class ValidationPipe implements PipeTransform
{
    constructor( private readonly schema: any )
    {
    }

    async transform( value: any, metadata: ArgumentMetadata ): Promise<any>
    {
        try
        {
            await this.schema.validate(value, { abortEarly: false });
            return value;
        }
        catch( exception )
        {
            throw new ValidationErrorException(exception.message);
        }
    }
}