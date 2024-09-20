/**
 * This file is used to declare environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI: string;
    MONGO_NAME: string;
    APP_PORT: number;
    APP_HOST: string;
    BUILD_MODE: string;
  }
}
