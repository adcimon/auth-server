import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as express from 'express';

@Injectable()
export class BodyParserMiddleware implements NestMiddleware {
	private jsonParser;
	private urlencodedParser;

	constructor() {
		const maxRequestSize: string = ConfigService.getEnvironmentVariable<string>('MAX_REQUEST_SIZE', '50mb');

		this.jsonParser = express.json({
			limit: maxRequestSize,
		});

		this.urlencodedParser = express.urlencoded({
			limit: maxRequestSize,
			extended: true,
		});
	}

	use(req: any, res: any, next: () => void) {
		this.jsonParser(req, res, (err) => {
			if (err) {
				return next();
			}
			this.urlencodedParser(req, res, next);
		});
	}
}
