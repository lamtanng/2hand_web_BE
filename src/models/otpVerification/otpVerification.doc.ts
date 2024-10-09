import mongoose, { Schema } from 'mongoose';
import { OTPVerificationProps } from '../../types/model/otpVerification.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';

export interface IOtpVerificationMethods {
  comparePassword: (password: string) => Promise<boolean>;
}
export const OTP_VERIFICATION_COLLECTION_NAME = 'otpVerification';
export const OTP_VERIFICATION_COLLECTION_SCHEMA = new Schema<OTPVerificationProps>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
  otp: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_COLLECTION_NAME,
  },
  email: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    default: new Date(),
  },
});
OTP_VERIFICATION_COLLECTION_SCHEMA.index({ expiredAt: 1 }, { expireAfterSeconds: 120 });
