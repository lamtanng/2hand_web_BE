import mongoose, { Schema } from 'mongoose';
import { StoreProps } from '../../types/store.type';
import { USER_COLLECTION_NAME } from '../user/user.schema';

export interface StoreDocument extends StoreProps, Document {}

export const STORE_COLLECTION_NAME = 'Store';
export const STORE_COLLECTION_SCHEMA = new Schema<StoreDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    address: [
      {
        type: String,
      },
    ],
    avatar: {
      type: String,
    },
    coverImg: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
  },
  { timestamps: true },
);
