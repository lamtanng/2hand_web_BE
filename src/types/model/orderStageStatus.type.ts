import mongoose from 'mongoose';
import { OrderStageStatus } from '../enum/orderStageStatus.enum';

export interface OrderStageStatusProps {
  _id: mongoose.Types.ObjectId;
  status: OrderStageStatus;
  expectedDate?: Date;
  date?: Date;
  orderStageID: mongoose.Types.ObjectId;
  orderRequestID: mongoose.Types.ObjectId;
}
