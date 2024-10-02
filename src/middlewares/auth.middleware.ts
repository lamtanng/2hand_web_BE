import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/error.type';
import { catchAuthErrors } from '../utils/catchErrors';
import { verifyAccessToken } from '../utils/jwt';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    const decodedToken = await verifyAccessToken(accessToken);
    // req. = decodedToken;
    next();
  } catch (error: AppError) {
    catchAuthErrors(error, next);
  }
};