import { registerAs } from '@nestjs/config';

export const DBConfig = registerAs('db', () => ({
  prodBranchUrl: process.env.PROD_BRANCH_URL,
  devBranchUrl: process.env.DEV_BRANCH_URL,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
}));

export const JWTConfig = registerAs('jwt', () => ({
  secretKey: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

export const CloudinaryConfig = registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}));
