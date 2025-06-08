import mongoose from 'mongoose';
import { SearchHistoryProps } from '../../types/model/searchHistory.type';
import {
  SEARCHHISTORY_COLLECTION_NAME,
  SEARCHHISTORY_COLLECTION_SCHEMA,
} from './searchHistory.doc';

export const SearchHistoryModel = mongoose.model<SearchHistoryProps>(
  SEARCHHISTORY_COLLECTION_NAME,
  SEARCHHISTORY_COLLECTION_SCHEMA,
);