import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { AppError } from '../types/error.type';
import { handleError } from '../utils/catchErrors';
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

const catchAuthErrors = (error: AppError, next: NextFunction) => {
  // Token is expired
  if (error.message?.includes(HttpMessage.EXPIRED_JWT_MGS.ERROR)) {
    handleError({
      message: HttpMessage.EXPIRED_JWT_MGS.RESPONSE,
      statusCode: StatusCodes.GONE,
      next,
    });
  }

  // Token is invalid or empty
  handleError({
    message: ReasonPhrases.UNAUTHORIZED,
    statusCode: StatusCodes.UNAUTHORIZED,
    next,
  });
};
