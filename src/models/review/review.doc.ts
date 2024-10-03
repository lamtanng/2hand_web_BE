import mongoose, { Schema } from 'mongoose';
import { ReviewProps } from '../../types/reivew.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { PRODUCT_COLLECTION_NAME } from '../product/product.doc';

export interface ReviewDocument extends ReviewProps, Document {}

export const REVIEW_COLLECTION_NAME = 'review';
export const REVIEW_COLLECTION_SCHEMA = new Schema<ReviewDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    content: {
      type: String,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    image: [{ type: String }],
    video: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    replyMessage: {
      type: String,
    },
    reviewerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    }
  },
  { timestamps: true },
);