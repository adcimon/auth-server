import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';

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
        catch( err )
        {
            throw new BadRequestException(err.message);
        }
    }
}