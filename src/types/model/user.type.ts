import mongoose from 'mongoose';

export interface AddressProps {
  _id: mongoose.Schema.Types.ObjectId;
  address: string;
  cityCode: number;
  districtCode: number;
  provincesCode: number;
  isDefault: boolean;
}

export interface UserProps {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  address: AddressProps[];
  createAt?: Date;
  updateAt?: Date;
  isActive: boolean;
  isVerified: boolean;
  roleID: mongoose.Schema.Types.ObjectId[];
  followerID?: mongoose.Schema.Types.ObjectId[];
  followingID?: mongoose.Schema.Types.ObjectId[];
  blockedID?: mongoose.Schema.Types.ObjectId[];
}
