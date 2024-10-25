import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';

const isCheckout = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { resultCode, message } = req.body;
  if (resultCode == 4001) {
    next();
    return;
  }

  throw new ApiError({
    message,
    statusCode: resultCode,
  });
});

export const orderMiddleware = { isCheckout };
