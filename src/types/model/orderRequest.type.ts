import mongoose from 'mongoose';

export interface OrderRequestProps {
  _id: mongoose.Types.ObjectId;
  description: string;
  image: string[];
  video: string[];
  task: string;
  replyStatus: string;
  replyMessage: string;
  reasonID: mongoose.Types.ObjectId;
  orderStageStatusID: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
