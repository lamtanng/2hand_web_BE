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
      default: function() {
        const date = new Date(Date.now());
        date.setDate(date.getDate() + 3);
        return date;
      },
    },
    receiverAddress: [
      {
        type: String,
      },
    ],
    note: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      min: 0,
      default: 0,
    },
    shipmentCost: {
      type: Number,
      required: true,
      min: 0,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: STORE_COLLECTION_NAME,
      required: true,
    },
    orderStatusID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDERSTATUS_COLLECTION_NAME,
      required: true
    },
    paymentMethodID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PAYMENTMETHOD_COLLECTION_NAME,
      required: true,
    },
  },
  { timestamps: true },
);
