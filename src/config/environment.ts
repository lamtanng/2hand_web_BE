import dotenv from 'dotenv';
import ApiError from '../utils/classes/ApiError';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new ApiError({
      statusCode: StatusCodes.NOT_FOUND,
      message: `Environment variable ${key} is not defined`,
    });
  }

  return value;
};

export const env = {
  APP_HOST: getEnv('APP_HOST'),
  APP_PORT: Number(getEnv('APP_PORT')),
  MONGO_URI: getEnv('MONGO_URI'),
  MONGO_NAME: getEnv('MONGO_NAME'),
  BUILD_MODE: getEnv('BUILD_MODE'),
  ACCESS_TOKEN_SECRET_KEY: getEnv('ACCESS_TOKEN_SECRET_KEY'),
  ACCESS_TOKEN_EXPIRED: getEnv('ACCESS_TOKEN_EXPIRED'),
  REFRESH_TOKEN_SECRET_KEY: getEnv('REFRESH_TOKEN_SECRET_KEY'),
  REFRESH_TOKEN_EXPIRED: getEnv('REFRESH_TOKEN_EXPIRED'),
  CLIENT_ORIGIN: getEnv('CLIENT_ORIGIN'),
};
