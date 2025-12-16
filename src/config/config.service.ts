import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationErrorException } from '../exceptions/configuration-error.exception';
import { config } from 'dotenv';
import { join } from 'path';

@Injectable()
export class ConfigService {
	private readonly logger = new Logger(ConfigService.name);

	constructor() {}

	public static config(): any {
		config();
		if (process.env.NODE_ENV !== 'production') {
			console.log('Environment variables:');
			Object.keys(process.env).forEach((key: string) => {
				console.log(key + '=' + process.env[key]);
			});
		}
	}

	private static parse(value: string): unknown {
		if (value === '') {
			return value;
		}

		if (value === 'true') {
			return true;
		}

		if (value === 'false') {
			return false;
		}

		const numeric: number = Number(value);
		if (!isNaN(numeric)) {
			return numeric;
		}

		try {
			const obj: object = JSON.parse(value);
			return obj;
		} catch {}

		const array: string[] = value.split(',');
		if (array.length === 0) {
			return value;
		}
		if (array.length === 1) {
			return array[0];
		}
		if (array.length > 1) {
			return array;
		}

		return value;
	}

	/**
	 * Get an environment variable.
	 */
	public static getEnvironmentVariable<T = string>(key: string, defaultValue?: T): T {
		if (!(key in process.env)) {
			return defaultValue;
		}

		const value: string = process.env[key];
		const parsedValue: T = ConfigService.parse(value) as T;

		return parsedValue;
	}

	/**
	 * Get a configuration variable.
	 */
	public getVariable<T = string>(key: string, defaultValue?: T): any {
		try {
			const value: T = ConfigService.getEnvironmentVariable<T>(key, defaultValue);
			return value;
		} catch (error: any) {
			this.logger.log(error);
			throw new ConfigurationErrorException(error.message);
		}
	}

	/**
	 * Get the service name.
	 */
	public getServiceName(): string {
		const key: string = 'SERVICE_NAME';
		if (key in process.env) {
			return process.env[key];
		} else {
			return 'Auth Server';
		}
	}

	/**
	 * Get the static path.
	 */
	public getStaticPath(): string {
		return join(__dirname, process.env.STATIC_PATH);
	}

	/**
	 * Is a production environment?
	 */
	public isProduction(): boolean {
		return process.env.NODE_ENV === 'production';
	}
}
