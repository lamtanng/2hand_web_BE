import mongoose, { Schema } from 'mongoose';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { SearchHistoryProps } from '../../types/model/searchHistory.type';

export const SEARCHHISTORY_COLLECTION_NAME = 'searchHistory';
export const SEARCHHISTORY_COLLECTION_SCHEMA = new Schema<SearchHistoryProps>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    searchText: {
      type: String,
      required: true,
    },
    searchTextUnaccented: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

SEARCHHISTORY_COLLECTION_SCHEMA.index({ slug: 1 });