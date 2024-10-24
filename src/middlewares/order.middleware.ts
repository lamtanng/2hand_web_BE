import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';

export const isCheckout = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, requestId, resultCode, message } = req.body;
  if (resultCode == 4001) {
    next();
  }

  throw new ApiError({
    message,
    statusCode: resultCode,
  });
});
