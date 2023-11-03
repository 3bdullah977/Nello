import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import { DBConfig } from '@/config';
import * as postgres from 'postgres';
import { DefaultLogger, LogWriter } from 'drizzle-orm';

export const DB = Symbol('DB_SERVICE');
export type DBType = PostgresJsDatabase;

export const DBProvider: FactoryProvider = {
  provide: DB,
  inject: [DBConfig.KEY],
  useFactory: (dbConfig: ConfigType<typeof DBConfig>) => {
    const logger = new Logger('db');

    logger.debug('Connecting to DB...');

    const connection = postgres({
      username: dbConfig.username,
      password: dbConfig.password,
      host: dbConfig.host,
      port: parseInt(dbConfig.port),
      max: 10,
      idle_timeout: 60000,
      database: dbConfig.database,
    });

    logger.debug('Connected to DB!');

    class CustomDbLogWriter implements LogWriter {
      write(message: string) {
        logger.verbose(message);
      }
    }

    return drizzle(connection, {
      logger: new DefaultLogger({ writer: new CustomDbLogWriter() }),
    });
  },
};
