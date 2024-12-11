import { OTPVerificationProps } from '../model/otpVerification.type';
import { UserProps } from '../model/user.type';

export type VerifyOtpRequestProps = Pick<UserProps, 'password'> &
  Pick<OTPVerificationProps, 'otp' | 'phoneNumber'>;

export type VerifySmsOtpRequestProps = Required<
  Pick<UserProps, '_id'> & Pick<OTPVerificationProps, 'otp' | 'phoneNumber'>
>;

export type SendOtpRequestProps = Pick<OTPVerificationProps, 'phoneNumber'>;
export type SendSmsOtpRequestProps = Required<Pick<OTPVerificationProps, 'phoneNumber'>>;
