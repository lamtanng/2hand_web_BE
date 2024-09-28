/**
 * This file is used to declare environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    MONGO_NAME: string;
    APP_PORT: string;
    APP_HOST: string;
    BUILD_MODE: string;
    ACCESS_TOKEN_SECRET_KEY: string;
    ACCESS_TOKEN_EXPIRED: string;
    REFRESH_TOKEN_SECRET_KEY: string;
    REFRESH_TOKEN_EXPIRED: string;
    CLIENT_ORIGIN: string;
  }
}
