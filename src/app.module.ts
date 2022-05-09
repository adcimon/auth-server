import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
    imports: [
        // * Config module.
        ConfigModule,

        // * Serve static module.
        ServeStaticModule.forRootAsync(
        {
            inject: [ConfigService],
            useFactory: ( configService: ConfigService ) =>
            {
                return [{ rootPath: configService.getStaticPath() }];
            }
        }),

        // * Schedule module.
        // Initializes the scheduler and registers any declarative cron jobs, timeouts and intervals that exist within the app.
        ScheduleModule.forRoot(),

        // * Type ORM module.
        // Get the configuration settings from the config service asynchronously.
        TypeOrmModule.forRootAsync(
        {
            inject: [ConfigService],
            useFactory: ( configService: ConfigService ) =>
            {
                return {
                    type: configService.get('DATABASE_TYPE'),
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                    database: configService.get('DATABASE_NAME'),
                    entities: [configService.get('DATABASE_ENTITIES')],
                    synchronize: !configService.isProduction()
                };
            },
        }),

        // * Role module.
        RoleModule,

        // * User module.
        UserModule,

        // * Auth module.
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule
{
    configure( consumer: MiddlewareConsumer )
    {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}