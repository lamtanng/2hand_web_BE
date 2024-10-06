import mongoose, { Schema } from 'mongoose';
import { ProductProps } from '../../types/product.type';
import { CATEGORY_COLLECTION_NAME } from '../category/category.doc';
import { STORE_COLLECTION_NAME } from '../store/store.doc';

export interface ProductDocument extends ProductProps, Document {}

export const PRODUCT_COLLECTION_NAME = 'product';
export const PRODUCT_COLLECTION_SCHEMA = new Schema<ProductDocument>(
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
    description: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
    cateID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CATEGORY_COLLECTION_NAME,
      required: true
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: STORE_COLLECTION_NAME,
      required: true
    },
  },
  { timestamps: true },
);
