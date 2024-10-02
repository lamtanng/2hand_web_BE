import { CorsOptions } from 'cors';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/environment';

export const corsOptions: CorsOptions = {
  origin: env.CLIENT_ORIGIN,
  credentials: true,
  optionsSuccessStatus: StatusCodes.OK,
};
