import mongoose from 'mongoose';
import { OrderStage } from '../enum/orderStage.enum';

export interface OrderStageProps {
  _id: mongoose.Schema.Types.ObjectId;
  name: OrderStage;
  orderStageStatusID: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
