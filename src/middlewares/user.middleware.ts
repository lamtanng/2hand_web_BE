import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { UserModel } from '../models/user';
import { catchErrors, handleError } from '../utils/catchErrors';

const isPhoneNumberExists = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber } = req.body;
  const existingPhoneNumber = await UserModel.findOne({ phoneNumber });
  if (existingPhoneNumber) {
    handleError({
      message: HttpMessage.CONFLICT.PHONE_NUMBER,
      statusCode: StatusCodes.CONFLICT,
      next,
    });
  }
  next();
});

export const userMiddleware = { isPhoneNumberExists };
