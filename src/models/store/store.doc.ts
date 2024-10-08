import mongoose, { Schema } from 'mongoose';
import { StoreProps } from '../../types/model/store.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';

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
      unique: true,
      default: function () {
        return this.name.toLowerCase().replaceAll(' ', '-');
      },
    },
    description: {
      type: String,
      default: null,
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
