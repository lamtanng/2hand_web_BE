import mongoose, { Schema } from 'mongoose';
import { OrderProps } from '../../types/order.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { STORE_COLLECTION_NAME } from '../store/store.doc';
import { ORDERSTATUS_COLLECTION_NAME } from '../orderStatus/orderStatus.doc';
import { PAYMENTMETHOD_COLLECTION_NAME } from '../paymentMethod/paymentMethod.doc';

export interface OrderDocument extends OrderProps, Document {}

export const ORDER_COLLECTION_NAME = 'order';
export const ORDER_COLLECTION_SCHEMA = new Schema<OrderDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    exprDate: {
      type: Date,
      required: true,
    },
    receiverAddress: [
      {
        type: String,
      },
    ],
    note: {
      type: String,
    },
    total: {
      type: Number,
      required: true,
    },
    shipmentCost: {
      type: Number,
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: STORE_COLLECTION_NAME,
    },
    orderStatusID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDERSTATUS_COLLECTION_NAME,
    },
    paymentMethodID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PAYMENTMETHOD_COLLECTION_NAME,
    },
  },
  { timestamps: true },
);
