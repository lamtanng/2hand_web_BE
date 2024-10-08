import mongoose, { Schema } from 'mongoose';
import { ReportObjectProps } from '../../types/model/reportObject.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { PRODUCT_COLLECTION_NAME } from '../product/product.doc';
import { REVIEW_COLLECTION_NAME } from '../review/review.doc';
import { STORE_COLLECTION_NAME } from '../store/store.doc';
import { ObjectType } from '../../types/enum/objectType.enum';

export interface ReportObjectDocument extends ReportObjectProps, Document {}

export const REPORTOBJECT_SCHEMA = new Schema<ReportObjectDocument>({
  type: {
    type: String,
    enum: {
      values: [ObjectType.Product, ObjectType.Review, ObjectType.Store, ObjectType.User],
    },
    required: true,
  },
  objectID: {
    type: mongoose.Schema.Types.ObjectId,
    ref:
      USER_COLLECTION_NAME ||
      PRODUCT_COLLECTION_NAME ||
      REVIEW_COLLECTION_NAME ||
      STORE_COLLECTION_NAME,
    required: true,
  },
});
