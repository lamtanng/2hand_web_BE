import { NextFunction, Request, Response } from 'express';
import ApiError from './ApiError';
import { AppError } from '../types/error.type';
import { StatusCodes } from 'http-status-codes';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type HandleErrorProps = { message: string; statusCode: number; next: NextFunction };

export const catchErrors = (asyncFunc: AsyncController): AsyncController => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunc(req, res, next);
    } catch (error: AppError) {
      handleError({ message: error.message, statusCode: error.statusCode, next });
    }
  };
};

export const handleError = async ({ message, statusCode, next }: HandleErrorProps) => {
  const customError = new ApiError({
    message: message,
    statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  });
  next(customError);
};
