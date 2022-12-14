import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { ConfigService } from './config/config.service';
import * as express from 'express';
import * as fs from 'fs';

async function bootstrap()
{
	let httpsOptions: any = null;
	if( ConfigService.get('ENABLE_HTTPS') )
	{
		httpsOptions = { };
		httpsOptions['key'] = fs.readFileSync(ConfigService.get('KEY_PATH'));
		httpsOptions['cert'] = fs.readFileSync(ConfigService.get('CERT_PATH'))
	}

	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule,
	{
		httpsOptions: httpsOptions
	});
	app.useGlobalFilters(new HttpExceptionFilter());

	if( ConfigService.get('ENABLE_CORS') )
	{
		app.enableCors();
	}

	app.use(express.json(
	{
		limit: ConfigService.get('MAX_REQUEST_SIZE')
	}));

	app.use(express.urlencoded(
	{
		limit: ConfigService.get('MAX_REQUEST_SIZE'),
		extended: true
	}));

	await app.listen(ConfigService.get('PORT') || 9000);

	const url: string = await app.getUrl();
	console.log(`🚀 Service running on: ${url}`);
}

ConfigService.config();
bootstrap();