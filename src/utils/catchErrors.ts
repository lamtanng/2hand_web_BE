import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { AppError } from '../types/error.type';
import ApiError, { ApiErrorProps } from './classes/ApiError';
import { TokenExpiredError } from 'jsonwebtoken';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;
interface HandleErrorProps extends ApiErrorProps {
  next: NextFunction;
}

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
