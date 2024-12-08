import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { TokenExpiredError } from 'jsonwebtoken';
import { HttpMessage } from '../constants/httpMessage';
import { AppError } from '../types/error.type';
import ApiError, { ApiErrorProps } from './classes/ApiError';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type ServiceFunc = (req: Request, res: Response) => Promise<any>;
interface HandleErrorProps extends ApiErrorProps {
  next: NextFunction;
}

export const catchErrors = (asyncFunc: AsyncController): AsyncController => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await asyncFunc(req, res, next);
    } catch (error: AppError) {
      handleError({ message: error.message, statusCode: error.statusCode, data: error.data, next });
    }
  };
};

export const catchServiceFunc = (asyncFunc: ServiceFunc) => {
  return async (req: Request, res: Response) => {
    try {
      return await asyncFunc(req, res);
    } catch (error: AppError) {
      return new ApiError({
        message: error.message,
        statusCode: error.statusCode,
        data: error.data,
      }).rejectError();
    }
  };
};

export const handleError = async ({ message, statusCode, data, next }: HandleErrorProps) => {
  const customError = new ApiError({
    message: message,
    statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    data,
  });
  next(customError);
  return;
};

export const catchAuthErrors = (error: AppError, next?: NextFunction) => {
  // Token is invalid or empty
  let message = ReasonPhrases.UNAUTHORIZED as string;
  let statusCode = StatusCodes.UNAUTHORIZED;

  // Token is expired
  if (error instanceof TokenExpiredError) {
    message = HttpMessage.EXPIRED_MGS.TOKEN;
    statusCode = StatusCodes.GONE;
  }

  if (!!next) handleError({ message, statusCode, next });
  else return new ApiError({ message, statusCode }).rejectError();
};
