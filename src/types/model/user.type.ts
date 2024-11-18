import mongoose from 'mongoose';
import { AddressProps } from './address.type';

export interface UserProps {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: AddressProps[];
  slug: string;
  avatar?: string;
  createAt?: Date;
  updateAt?: Date;
  isActive: boolean;
  isVerified: boolean;
  roleID: mongoose.Schema.Types.ObjectId[];
  followerID?: mongoose.Schema.Types.ObjectId[];
  followingID?: mongoose.Schema.Types.ObjectId[];
  blockedID?: mongoose.Schema.Types.ObjectId[];
}
