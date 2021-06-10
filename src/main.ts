import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

import { config } from 'dotenv';

async function bootstrap()
{
    console.log("Environment variables:");
    Object.keys(process.env).forEach(function( key )
    {
        console.log(key + '=' + process.env[key]);
    });

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    await app.listen(process.env.PORT || 3000);
}

config();
bootstrap();