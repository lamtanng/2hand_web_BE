import mongoose from 'mongoose';
import {
  OTP_VERIFICATION_COLLECTION_NAME,
  OTP_VERIFICATION_COLLECTION_SCHEMA,
} from './otpVerification.doc';

export const OTPVerificationModel = mongoose.model(
  OTP_VERIFICATION_COLLECTION_NAME,
  OTP_VERIFICATION_COLLECTION_SCHEMA,
);
