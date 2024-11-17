import mongoose, { Schema } from 'mongoose';
import { CategoryProps } from '../../types/model/category.type';
import { generateSlug } from '../../utils/slug';

export interface CategoryDocument extends CategoryProps, Document {}

export const CATEGORY_COLLECTION_NAME = 'Category';
export const CATEGORY_COLLECTION_SCHEMA = new Schema<CategoryDocument>(
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
    slug: {
      type: String,
      unique: true,
      default: function () {
        return generateSlug(this.name);
      },
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CATEGORY_COLLECTION_NAME,
      default: null,
    },
    childrenIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY_COLLECTION_NAME,
        default: null,
      },
    ],
  },
  { timestamps: true },
);
