import dotenv from 'dotenv';

dotenv.config();

export interface ENV extends NodeJS.ProcessEnv {}

export const env = {
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  MONGO_URI: process.env.MONGO_URI,
  MONGO_NAME: process.env.MONGO_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
} as ENV;
