import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/classes/ApiError';

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
  APP_NAME: getEnv('APP_NAME'),
  MONGO_URI: getEnv('MONGO_URI'),
  MONGO_NAME: getEnv('MONGO_NAME'),
  BUILD_MODE: getEnv('BUILD_MODE'),
  ACCESS_TOKEN_SECRET_KEY: getEnv('ACCESS_TOKEN_SECRET_KEY'),
  ACCESS_TOKEN_EXPIRED: getEnv('ACCESS_TOKEN_EXPIRED'),
  REFRESH_TOKEN_SECRET_KEY: getEnv('REFRESH_TOKEN_SECRET_KEY'),
  REFRESH_TOKEN_EXPIRED: getEnv('REFRESH_TOKEN_EXPIRED'),
  CLIENT_ORIGIN: getEnv('CLIENT_ORIGIN'),
  EMAIL_ADDRESS: getEnv('EMAIL_ADDRESS'),
  EMAIL_PASSWORD: getEnv('EMAIL_PASSWORD'),
  EMAIL_HOST: getEnv('EMAIL_HOST'),
  MOMO_ACCESS_KEY: getEnv('MOMO_ACCESS_KEY'),
  MOMO_SECRET_KEY: getEnv('MOMO_SECRET_KEY'),
  MOMO_IPN_URL: getEnv('MOMO_IPN_URL'),
  GHN_TOKEN: getEnv('GHN_TOKEN'),
  CLOUDINARY_API_KEY: getEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnv('CLOUDINARY_API_SECRET'),
  CLOUDINARY_NAME: getEnv('CLOUDINARY_NAME'),
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY'),
};
