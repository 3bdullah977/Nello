import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv'; // installed by @nestjs/config
dotenv.config();

export default {
  strict: true,
  driver: 'pg',
  schema: './src/_schemas/*',
  dbCredentials: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
  },
  out: './drizzle',
  verbose: true,
} satisfies Config;
