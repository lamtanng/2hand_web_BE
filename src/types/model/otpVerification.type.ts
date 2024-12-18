import { ObjectId } from 'mongoose';

export interface OTPVerificationProps {
  _id: ObjectId;
  otp: string;
  userID: ObjectId;
  email?: string;
  phoneNumber: string;
  createdAt: Date;
  expiredAt: Date;
}
