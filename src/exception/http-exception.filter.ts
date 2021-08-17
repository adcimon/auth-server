import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { GenericErrorException } from './generic-error.exception';
import { InvalidRequestException } from './invalid-request.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter
{
    catch( exception: HttpException, host: ArgumentsHost )
    {
        const context = host.switchToHttp();
        const request = context.getRequest<Request>();
        const response = context.getResponse<Response>();
        let json = { };

        if( !(exception instanceof HttpException) )
        {
            exception = new GenericErrorException((exception as Error)?.message);
            json = exception.getResponse();
        }
        else
        {
            json = exception.getResponse();
            if( json['statusCode'] !== undefined )
            {
                switch( json['statusCode'] )
                {
                    case 404:
                    {
                        exception = new InvalidRequestException();
                        json = exception.getResponse();
                        break;
                    }
                    default:
                    {
                        exception = new GenericErrorException(exception.message);
                        json = exception.getResponse();
                        break;
                    }
                }
            }
        }

        json['url'] = request.url;
        json['timestamp'] = (new Date()).toISOString();

        response
        .status(exception.getStatus())
        .json(json);
    }
}