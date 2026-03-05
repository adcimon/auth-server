import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from './config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { BodyParserMiddleware } from './middlewares/body-parser.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { SerializerInterceptor } from './interceptors/serializer.interceptor';
import { ExceptionFilter } from './exceptions/exception.filter';

@Module({
	imports: [
		ConfigModule,
		ServeStaticModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return [{ rootPath: configService.getStaticPath() }];
			},
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: configService.getVariable('DATABASE_TYPE'),
					host: configService.getVariable('DATABASE_HOST'),
					port: configService.getVariable<number>('DATABASE_PORT'),
					username: configService.getVariable('DATABASE_USERNAME'),
					password: configService.getVariable('DATABASE_PASSWORD'),
					database: configService.getVariable('DATABASE_NAME'),
					entities: [configService.getVariable('DATABASE_ENTITIES')],
					synchronize: !configService.isProduction(),
				};
			},
		}),
		RolesModule,
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: SerializerInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ExceptionFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(BodyParserMiddleware).forRoutes('*');
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
