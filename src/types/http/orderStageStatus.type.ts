import mongoose from 'mongoose';
import { OrderStageStatusProps } from '../model/orderStageStatus.type';

export interface c extends Omit<OrderStageStatusProps, '_id'> {
  orderStageID: mongoose.Types.ObjectId;
}
