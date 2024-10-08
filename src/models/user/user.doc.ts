import mongoose, { Model, Schema } from 'mongoose';
import { UserProps } from '../../types/model/user.type';
import { ROLE_COLLECTION_NAME } from '../role/role.doc';

export interface IUserMethods {
  comparePassword: (password: string) => Promise<boolean>;
}
export interface IUserStatics {
  findByEmail: (email: string) => any;
}
export interface IUserQueries {}
export interface IUserModel extends Model<UserProps, IUserQueries, IUserMethods> {}

export const USER_COLLECTION_NAME = 'user';
export const USER_COLLECTION_SCHEMA = new Schema<
  UserProps,
  IUserModel,
  IUserStatics,
  IUserQueries,
  {},
  IUserMethods
>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNumber: {
      type: String,
      length: 10,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: new Date(),
    },
    address: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    roleID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ROLE_COLLECTION_NAME,
        required: true,
      },
    ],
    followerID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
      },
    ],
    followingID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
      },
    ],
    blockedID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME,
      },
    ],
  },
  {
    timestamps: true,
  },
);
