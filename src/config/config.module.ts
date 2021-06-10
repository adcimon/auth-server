import { Module, Global } from '@nestjs/common';

// Imports.

// Controllers.

// Providers.
import { ConfigService } from './config.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [ConfigService],
    exports: [ConfigService]
})
export class ConfigModule { }