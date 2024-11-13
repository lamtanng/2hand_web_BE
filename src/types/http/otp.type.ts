import { OTPVerificationProps } from '../model/otpVerification.type';
import { UserProps } from '../model/user.type';

export type VerifyOtpRequestProps = Pick<UserProps, 'password'> &
  Pick<OTPVerificationProps, 'otp' | 'email'>;

export type VerifySmsOtpRequestProps = Required<
  Pick<UserProps, '_id'> & Pick<OTPVerificationProps, 'otp' | 'phoneNumber'>
>;

export type SendOtpRequestProps = Pick<OTPVerificationProps, 'email'>;
export type SendSmsOtpRequestProps = Required<Pick<OTPVerificationProps, 'phoneNumber'>>;
