import mongoose, { Schema } from 'mongoose';
import { CartProps } from '../../types/cart.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { CARTITEM_SCHEMA } from '../cartItem/cartItem.doc';

export interface CartDocument extends CartProps, Document {}

export const CART_COLLECTION_NAME = 'cart';
export const CART_COLLECTION_SCHEMA = new Schema<CartDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
    },
    products: [
      {
        type: Map,
        of: CARTITEM_SCHEMA,
      },
    ],
  },
  { timestamps: true },
);
