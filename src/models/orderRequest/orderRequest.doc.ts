import mongoose, { Schema } from 'mongoose';
import { OrderRequestProps } from '../../types/orderRequest.type';
import { REASON_COLLECTION_NAME } from '../reason/reason.doc';
import { ORDER_COLLECTION_NAME } from '../order/order.doc';

export interface OrderRequestDocument extends OrderRequestProps, Document {}

export const ORDERREQUEST_COLLECTION_NAME = 'orderRequest';
export const ORDERREQUEST_COLLECTION_SCHEMA = new Schema<OrderRequestDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    description: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    video: [
      {
        type: String,
      },
    ],
    task: {
      type: String,
    },
    replyStatus: {
      type: String,
    },
    replyMessage: {
      type: String,
    },
    reasonID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: REASON_COLLECTION_NAME,
      required: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDER_COLLECTION_NAME,
      required: true,
    },
  },
  { timestamps: true },
);
