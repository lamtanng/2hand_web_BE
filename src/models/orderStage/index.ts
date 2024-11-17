import mongoose from 'mongoose';
import { ORDERSTAGE_COLLECTION_NAME, ORDERSTAGE_COLLECTION_SCHEMA } from './orderStage.doc';

export const OrderStageModel = mongoose.model(
  ORDERSTAGE_COLLECTION_NAME,
  ORDERSTAGE_COLLECTION_SCHEMA,
);
