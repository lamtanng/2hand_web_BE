import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { emailTransporter } from '../constants/emailTransporter';
import { HttpMessage } from '../constants/httpMessage';
import { OTPVerificationModel } from '../models/otpVerification';
import { AppError } from '../types/error.type';
import { SendOtpRequestProps, VerifyOtpRequestProps } from '../types/http/otp.type';
import { UserProps } from '../types/model/user.type';
import { compareHash, hashValue } from '../utils/bcrypt';
import { catchErrors, handleError } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { mailOptions } from '../utils/mailOptions';
import { generateOTP } from '../utils/otp';

const isVerified = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    const { isVerified } = (await verifyAccessToken(accessToken)) as UserProps;
    if (isVerified === false)
      throw new ApiError({
        message: HttpMessage.NOT_VERIFY,
        statusCode: StatusCodes.UNAUTHORIZED,
      });

    next();
  } catch (error: AppError) {
    handleError({ message: error.message, statusCode: error.statusCode, next });
  }
};

const sendOtpVerificationEmail = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as SendOtpRequestProps;
    if (!email) {
      handleError({
        message: ReasonPhrases.BAD_REQUEST,
        statusCode: StatusCodes.BAD_REQUEST,
        next,
      });
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
    await OTPVerificationModel.create({ otp: hashedOtp, email });

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
    res.status(StatusCodes.ACCEPTED);
    next();
  } catch (error: AppError) {
    handleError({ message: error.message, statusCode: error.statusCode, next });
  }
};

export const otpMiddleware = { sendOtpVerificationEmail, verifyOTP, isVerified };
