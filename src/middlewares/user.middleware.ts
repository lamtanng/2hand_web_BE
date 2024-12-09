import { NextFunction, Request, Response } from 'express';
import { catchErrors, handleError } from '../utils/catchErrors';
import { UserModel } from '../models/user';
import { SendSmsOtpRequestProps } from '../types/http/otp.type';
import { HttpMessage } from '../constants/httpMessage';
import { StatusCodes } from 'http-status-codes';

const isPhoneNumberExists = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber } = req.body as SendSmsOtpRequestProps;
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
