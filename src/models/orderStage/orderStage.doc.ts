import mongoose, { Schema } from 'mongoose';
import { OrderStage } from '../../types/enum/orderStage.enum';
import { OrderStageProps } from '../../types/model/orderStage.type';
import { ORDER_STAGE_STATUS_COLLECTION_NAME } from '../orderStageStatus/orderStageStatus.doc';
import { ORDER_COLLECTION_NAME } from '../order/order.doc';

export interface OrderStageDocument extends OrderStageProps, Document {}

export const ORDERSTAGE_COLLECTION_NAME = 'orderStages';
export const ORDERSTAGE_COLLECTION_SCHEMA = new Schema<OrderStageDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    name: {
      type: String,
      required: true,
      enum: {
        values: [
          OrderStage.Cancelled,
          OrderStage.Confirmating,
          OrderStage.Delivered,
          OrderStage.Delivering,
          OrderStage.Picking,
          OrderStage.Returned,
        ],
      },
      default: OrderStage.Confirmating,
    },
    orderStageStatusID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDER_STAGE_STATUS_COLLECTION_NAME,
      required: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
    },
  },
  { timestamps: true },
);
