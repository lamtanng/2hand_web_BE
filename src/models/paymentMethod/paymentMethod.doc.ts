import mongoose, { Schema } from 'mongoose';
import { PaymentMethodProps } from '../../types/model/paymentMethod.type';

export interface PaymentMethodDocument extends PaymentMethodProps, Document {}

export const PAYMENTMETHOD_COLLECTION_NAME = 'paymentMethod';
export const PAYMENTMETHOD_COLLECTION_SCHEMA = new Schema(
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
  },
  { timestamps: true },
);
