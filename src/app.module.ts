import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

// Imports.
import { ConfigModule } from './config/config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { ConfigService } from './config/config.service';

// Controllers.

// Providers.

@Module({
    imports: [
        ConfigModule,
        ServeStaticModule.forRootAsync(
        {
            inject: [ConfigService],
            useFactory: ( configService: ConfigService ) =>
            {
                return [{ rootPath: configService.getStaticPath() }];
            }
        }),
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
        UserModule,
        AuthModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule
{
    configure( consumer: MiddlewareConsumer ): void
    {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}