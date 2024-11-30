import mongoose from 'mongoose';
import { TaskType } from '../enum/taskType.enum';
import { ReplyStatus } from '../enum/replyStatus.enum';

export interface OrderRequestProps {
  _id: mongoose.Types.ObjectId;
  description: string;
  image?: string[];
  video?: string[];
  taskType: TaskType;
  replyStatus: ReplyStatus;
  replyMessage?: string;
  reasonID: mongoose.Types.ObjectId;
  orderStageStatusID: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
