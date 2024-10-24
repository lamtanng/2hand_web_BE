/**
 * This file is used to declare environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    MONGO_NAME: string;
    APP_PORT: string;
    APP_HOST: string;
    APP_NAME: string;
    BUILD_MODE: string;
    ACCESS_TOKEN_SECRET_KEY: string;
    ACCESS_TOKEN_EXPIRED: string;
    REFRESH_TOKEN_SECRET_KEY: string;
    REFRESH_TOKEN_EXPIRED: string;
    CLIENT_ORIGIN: string;
    EMAIL_ADDRESS: string;
    EMAIL_PASSWORD: string;
    EMAIL_HOST: string;
    MOMO_ACCESS_KEY: string;
    MOMO_SECRET_KEY: string;
    MOMO_IPN_URL: string;
  }
}
