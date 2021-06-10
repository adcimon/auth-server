import { Injectable } from '@nestjs/common';

import { join } from 'path';

@Injectable()
export class ConfigService
{
    constructor()
    {
    }

    /**
     * Get a configuration value.
     * @param key
     * @param defaultValue
     * @returns any
     */
    get( key: string, defaultValue: any = null ): any
    {
        if( key in process.env )
        {
            return process.env[key];
        }
        else
        {
            if( defaultValue )
            {
                return defaultValue;
            }
            else
            {
                return null;
            }
        }
    }

    /**
     * Get the application name.
     * @returns string
     */
    getAppName(): string
    {
        const key = 'APP_NAME';
        if( key in process.env )
        {
            return process.env[key];
        }
        else
        {
            return 'Server';
        }
    }

    /**
     * Get the static path.
     * @returns string
     */
    getStaticPath(): string
    {
        return join(__dirname, process.env.STATIC_PATH);
    }

    /**
     * Is a production environment?
     * @returns boolean
     */
    isProduction(): boolean
    {
        return process.env.NODE_ENV === 'production';
    }
}