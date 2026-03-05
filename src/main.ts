import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import * as fs from 'fs';

async function main() {
	ConfigService.config();

	const port: number = ConfigService.getEnvironmentVariable<number>('PORT', 9000);
	const enableHttps: boolean = ConfigService.getEnvironmentVariable<boolean>('ENABLE_HTTPS', false);
	const keyPath: string = ConfigService.getEnvironmentVariable('KEY_PATH', '');
	const certPath: string = ConfigService.getEnvironmentVariable('CERT_PATH', '');
	const enableCors: boolean = ConfigService.getEnvironmentVariable<boolean>('ENABLE_CORS', true);
	const allowOrigins: string | string[] = ConfigService.getEnvironmentVariable<string | string[]>(
		'ALLOW_ORIGINS',
		'*',
	);
	const allowCredentials: boolean = ConfigService.getEnvironmentVariable<boolean>('ALLOW_CREDENTIALS', true);

	let httpsOptions: HttpsOptions = null;
	if (enableHttps) {
		httpsOptions = {};
		httpsOptions['key'] = fs.readFileSync(keyPath);
		httpsOptions['cert'] = fs.readFileSync(certPath);
	}

	let corsOptions: CorsOptions = null;
	if (enableCors) {
		const isAllowOriginsWildcard =
			allowOrigins === '*' || (Array.isArray(allowOrigins) && allowOrigins.includes('*'));

		if (isAllowOriginsWildcard && allowCredentials) {
			console.error(
				'❌ Invalid CORS configuration: Cannot use origin "*" when credentials are enabled. Please specify explicit allowed origins.',
			);
			process.exit(1);
		}

		corsOptions = {
			origin: allowOrigins,
			credentials: allowCredentials,
		};
	}

	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
		httpsOptions: httpsOptions,
		cors: corsOptions,
		bodyParser: false,
	});

	await app.init();

	await app.listen(port);

	const url: string = await app.getUrl();
	console.log(`🚀 Service running on ${url}`);
}

main();
