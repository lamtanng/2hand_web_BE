import mongoose, { Schema } from 'mongoose';
import { ReplyStatus } from '../../types/enum/replyStatus.enum';
import { TaskType } from '../../types/enum/taskType.enum';
import { OrderRequestProps } from '../../types/model/orderRequest.type';
import { ORDER_STAGE_STATUS_COLLECTION_NAME } from '../orderStageStatus/orderStageStatus.doc';
import { REASON_COLLECTION_NAME } from '../reason/reason.doc';

export interface OrderRequestDocument extends OrderRequestProps, Document {}

export const ORDERREQUEST_COLLECTION_NAME = 'orderRequest';
export const ORDERREQUEST_COLLECTION_SCHEMA = new Schema<OrderRequestDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    description: {
      type: String,
      default: null,
    },
    image: [
      {
        type: String,
      },
    ],
    video: [
      {
        type: String,
      },
    ],
    task: {
      type: String,
      enum: {
        values: [TaskType.Cancel, TaskType.Return],
      },
      required: true,
    },
    replyStatus: {
      type: String,
      enum: {
        values: [ReplyStatus.Pending, ReplyStatus.Succeeded, ReplyStatus.Rejected],
      },
      default: ReplyStatus.Pending,
    },
    replyMessage: {
      type: String,
      default: null,
    },
    reasonID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: REASON_COLLECTION_NAME,
      required: true,
    },
    orderStageStatusID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orderStageStatuses',
      required: true,
    },
  },
  { timestamps: true },
);
