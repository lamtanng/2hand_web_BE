import mongoose from 'mongoose';
import { OrderStageStatusProps } from '../../types/model/orderStageStatus.type';
import {
  IOrderStageStatusModel,
  IOrderStageStatusQueries,
  ORDER_STAGE_STATUS_COLLECTION_NAME,
  ORDER_STAGE_STATUS_COLLECTION_SCHEMA,
} from './orderStageStatus.doc';

export const OrderStageStatusModel = mongoose.model<
  OrderStageStatusProps,
  IOrderStageStatusModel,
  IOrderStageStatusQueries
>(ORDER_STAGE_STATUS_COLLECTION_NAME, ORDER_STAGE_STATUS_COLLECTION_SCHEMA);
