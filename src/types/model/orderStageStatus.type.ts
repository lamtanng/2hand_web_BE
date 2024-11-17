import mongoose from 'mongoose';

export interface OrderStageStatusProps {
  _id: mongoose.Types.ObjectId;
  name: string;
  expectedDate?: Date;
  date?: Date;
}
