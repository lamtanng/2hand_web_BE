import mongoose, { Model, Schema } from 'mongoose';
import { ProductQuality } from '../../types/enum/productQuality.enum';
import { ProductProps } from '../../types/model/product.type';
import { CATEGORY_COLLECTION_NAME } from '../category/category.doc';
import { STORE_COLLECTION_NAME } from '../store/store.doc';
import { generateSlug } from '../../utils/slug';

export interface ProductDocument extends ProductProps, Document {}

export interface IProductMethods {}
export interface IProductStatics {}
export interface IProductQueries {}
export interface IProductModel extends Model<ProductProps, IProductQueries, IProductMethods> {}

export const PRODUCT_COLLECTION_NAME = 'product';
export const PRODUCT_COLLECTION_SCHEMA = new Schema<
  ProductProps,
  IProductModel,
  IProductStatics,
  IProductQueries,
  {},
  IProductMethods
>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
      immutable: true,
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
      min: 1,
    },
    quality: {
      type: String,
      enum: {
        values: [
          ProductQuality.New,
          ProductQuality.LikeNew,
          ProductQuality.Good,
          ProductQuality.Average,
          ProductQuality.Old,
        ],
      },
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      default: function () {
        return generateSlug(this.name);
      },
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
      required: true,
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: STORE_COLLECTION_NAME,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true },
);
