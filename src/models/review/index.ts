import mongoose from 'mongoose';
import { REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA } from './review.doc';

REVIEW_COLLECTION_SCHEMA.query.findAll = function () {
  return (this as any).populate({ path: 'productID', populate: 'storeID' }).populate('reviewerID');
};

export const ReviewModel = mongoose.model(REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA);
