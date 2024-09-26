import { NextFunction, Request, Response } from 'express';
import ApiError from './ApiError';
import { AppError } from '../types/error.type';
import { StatusCodes } from 'http-status-codes';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const catchErrors = (asyncFunc: AsyncController): AsyncController => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunc(req, res, next);
    } catch (error: AppError) {
      const customError = new ApiError({
        message: new Error(error).message,
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      });
      next(customError);
    }
  };
};
