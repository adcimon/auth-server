import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ConfigService } from './config/config.service';

async function bootstrap()
{
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    if( ConfigService.get('ENABLE_CORS') )
    {
        app.enableCors();
    }

    await app.listen(ConfigService.get('PORT') || 9000);

    console.log(`Application running on: ${await app.getUrl()}`);
}

ConfigService.config();
bootstrap();