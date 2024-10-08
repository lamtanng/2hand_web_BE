import { OTPVerificationProps } from '../model/otpVerification.type';

export type VerifyOtpRequestProps = Pick<OTPVerificationProps, 'otp' | 'email'>;
export type SendOtpRequestProps = Pick<OTPVerificationProps, 'email'>;
