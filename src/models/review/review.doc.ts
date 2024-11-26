import mongoose, { Schema } from 'mongoose';
import { ReviewProps } from '../../types/model/review.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { PRODUCT_COLLECTION_NAME } from '../product/product.doc';
import { ORDERDETAIL_COLLECTION_NAME } from '../orderDetail/orderDetail.doc';

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
      default: null,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 0,
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
      default: null,
    },
    reviewerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PRODUCT_COLLECTION_NAME,
      required: true,
    },
    orderDetailID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDERDETAIL_COLLECTION_NAME,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true },
);
