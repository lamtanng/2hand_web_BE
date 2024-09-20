import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';

export interface AsyncFuncProps {
  err: ApiError;
  req: Request;
  res: Response;
  next: NextFunction;
}
