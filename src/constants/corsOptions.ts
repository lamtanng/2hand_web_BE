import { CorsOptions } from 'cors';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/environment';

export const corsOptions: CorsOptions = {
  origin: [env.CLIENT_ORIGIN, 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: StatusCodes.OK,
};
