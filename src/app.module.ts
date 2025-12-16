import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { LoggerMiddleware } from './log/logger.middleware';

@Module({
	imports: [
		ConfigModule,
		ServeStaticModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return [{ rootPath: configService.getStaticPath() }];
			},
		}),
		ScheduleModule.forRoot(), // Initializes the scheduler and registers any declarative cron jobs, timeouts and intervals that exist within the app.
		TypeOrmModule.forRootAsync(
			// Get the configuration settings from the config service asynchronously.
			{
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => {
					return {
						type: configService.getVariable('DATABASE_TYPE'),
						host: configService.getVariable('DATABASE_HOST'),
						port: configService.getVariable('DATABASE_PORT'),
						username: configService.getVariable('DATABASE_USERNAME'),
						password: configService.getVariable('DATABASE_PASSWORD'),
						database: configService.getVariable('DATABASE_NAME'),
						entities: [configService.getVariable('DATABASE_ENTITIES')],
						synchronize: !configService.isProduction(),
					};
				},
			},
		),
		RolesModule,
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
