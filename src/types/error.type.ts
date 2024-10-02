import { VerifyErrors } from 'jsonwebtoken';
import ApiError from '../utils/classes/ApiError';

export type AppError = Error | ApiError | VerifyErrors | any;
