import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { emailTransporter } from '../constants/emailTransporter';
import { HttpMessage } from '../constants/httpMessage';
import { OTPVerificationModel } from '../models/otpVerification';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { SendOtpRequestProps, VerifyOtpRequestProps } from '../types/http/otp.type';
import { UserProps } from '../types/user.type';
import { compareHash, hashValue } from '../utils/bcrypt';
import { catchErrors, handleError } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { mailOptions } from '../utils/mailOptions';
import { generateOTP } from '../utils/otp';

const sendOtpVerificationEmail = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as SendOtpRequestProps;
    if (!email) {
      handleError({ message: 'Missing field', statusCode: StatusCodes.BAD_REQUEST, next });
      return;
    }

    const otp = generateOTP();
    await emailTransporter.sendMail(
      mailOptions.getEmailVerificationOptions({
        to: email,
        OTPCode: otp,
      }),
    );

    const hashedOtp = await hashValue(String(otp));
    const { _id } = (await UserModel.findOne({ email })) as UserProps;

    //delete all previous OTP records before sending OTP code to email (re-sent otp)
    await OTPVerificationModel.deleteMany({ userID: _id });
    await OTPVerificationModel.create({ userID: _id, otp: hashedOtp, email });

    res.status(StatusCodes.OK);
    next();
  },
);

const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, email } = req.body as VerifyOtpRequestProps;

    const otpModel = await OTPVerificationModel.findOne({ email }).exec();
    if (!otpModel) {
      throw new ApiError({
        message: ReasonPhrases.UNAUTHORIZED,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    //
    const isExpired = Date.now() >= otpModel.expiredAt.getTime();
    if (isExpired) {
      throw new ApiError({
        message: HttpMessage.EXPIRED_MGS.OTP,
        statusCode: StatusCodes.GONE,
      });
    }

    const isOtpCode = await compareHash(otp, otpModel?.otp);
    if (!isOtpCode) {
      throw new ApiError({
        message: HttpMessage.INCORRECT.OTP,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    //delete otp record when it is accepted
    await OTPVerificationModel.deleteMany({ email });
    await UserModel.findOneAndUpdate({ email }, { isVerified: true });
    res.status(StatusCodes.ACCEPTED);
    next();
  } catch (error: AppError) {
    handleError({ message: error.message, statusCode: error.statusCode, next });
  }
};

export const otpMiddleware = { sendOtpVerificationEmail, verifyOTP };
