import mongoose, { Schema } from 'mongoose';
import { OrderStatusProps } from '../../types/orderStatus.type';

export interface OrderStatusDocument extends OrderStatusProps, Document {}

export const ORDERSTATUS_COLLECTION_NAME = 'orderStatus';
export const ORDERSTATUS_COLLECTION_SCHEMA = new Schema<OrderStatusDocument>(
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
    stage: {
      type: Number,
      required: true,
      min: 1,
    }
  },
  { timestamps: true },
);
