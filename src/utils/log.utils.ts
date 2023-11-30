export namespace LogUtils {
	export const WHITE_COLOR: string = '\x1b[0m';
	export const RED_COLOR: string = '\x1b[31m';
	export const GREEN_COLOR: string = '\x1b[32m';
	export const YELLOW_COLOR: string = '\x1b[33m';
	export const CYAN_COLOR: string = '\x1b[36m';
	export const BASE_COLOR: string = WHITE_COLOR;

	export const log = (method: string, endpoint: string, status: number, message: string): string => {
		let methodColor: string = BASE_COLOR;
		switch (method) {
			case 'GET':
				methodColor = CYAN_COLOR;
				break;
			case 'POST':
				methodColor = GREEN_COLOR;
				break;
			case 'PATCH':
				methodColor = YELLOW_COLOR;
				break;
			case 'PUT':
				methodColor = YELLOW_COLOR;
				break;
			case 'DELETE':
				methodColor = RED_COLOR;
				break;
		}

		let statusColor = GREEN_COLOR;
		if (status >= 400) {
			statusColor = RED_COLOR;
		}

		return `${methodColor}${method} ${endpoint}${BASE_COLOR} (${statusColor}${status}${BASE_COLOR}) ${message}`;
	};
}
