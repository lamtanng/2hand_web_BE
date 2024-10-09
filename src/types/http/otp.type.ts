import { OTPVerificationProps } from '../model/otpVerification.type';
import { UserProps } from '../model/user.type';

export type VerifyOtpRequestProps = Pick<UserProps, 'password'> &
  Pick<OTPVerificationProps, 'otp' | 'email'>;

export type SendOtpRequestProps = Pick<OTPVerificationProps, 'email'>;
