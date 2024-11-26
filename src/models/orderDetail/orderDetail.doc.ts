import mongoose, { Schema } from 'mongoose';
import { OrderDetailProps } from '../../types/model/orderDetail.type';
import { PRODUCT_COLLECTION_NAME } from '../product/product.doc';
import { ORDER_COLLECTION_NAME } from '../order/order.doc';

export interface orderDetailDocument extends OrderDetailProps, Document {}

export const ORDERDETAIL_COLLECTION_NAME = 'orderDetail';
export const ORDERDETAIL_COLLECTION_SCHEMA = new Schema<orderDetailDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priceTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PRODUCT_COLLECTION_NAME,
      required: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
  },
  { timestamps: true },
);
