import mongoose from 'mongoose';
import { STORE_COLLECTION_NAME, STORE_COLLECTION_SCHEMA, StoreDocument } from './store.doc';

export const StoreModel = mongoose.model<StoreDocument>(
  STORE_COLLECTION_NAME,
  STORE_COLLECTION_SCHEMA,
);
