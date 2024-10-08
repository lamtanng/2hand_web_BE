import mongoose from 'mongoose';
import ms from 'ms';
import {
  OTP_VERIFICATION_COLLECTION_NAME,
  OTP_VERIFICATION_COLLECTION_SCHEMA,
} from './otpVerification.doc';

//middleware
OTP_VERIFICATION_COLLECTION_SCHEMA.pre('save', async function () {
  this.expiredAt = new Date(this.createdAt.getTime() + ms('120s'));
});

export const OTPVerificationModel = mongoose.model(
  OTP_VERIFICATION_COLLECTION_NAME,
  OTP_VERIFICATION_COLLECTION_SCHEMA,
);
