import mongoose, { Model, Schema } from 'mongoose';
import { OrderStageStatus } from '../../types/enum/orderStageStatus.enum';
import { OrderStageStatusProps } from '../../types/model/orderStageStatus.type';
import { ORDERREQUEST_COLLECTION_NAME } from '../orderRequest/orderRequest.doc';
import { ORDERSTAGE_COLLECTION_NAME } from '../orderStage/orderStage.doc';

export interface IOrderStageStatusMethods {}
export interface IOrderStageStatusStatics {}
export interface IOrderStageStatusQueries {}
export interface IOrderStageStatusModel
  extends Model<OrderStageStatusProps, IOrderStageStatusQueries, IOrderStageStatusMethods> {}

export const ORDER_STAGE_STATUS_COLLECTION_NAME = 'orderStageStatuses';
export const ORDER_STAGE_STATUS_COLLECTION_SCHEMA = new Schema<
  OrderStageStatusProps,
  IOrderStageStatusModel,
  IOrderStageStatusStatics,
  IOrderStageStatusQueries,
  {},
  IOrderStageStatusMethods
>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: [
          OrderStageStatus.Active,
          OrderStageStatus.RequestToAdmin,
          OrderStageStatus.RequestToSeller,
        ],
      },
      default: OrderStageStatus.Active,
    },
    expectedDate: {
      type: Date,
      default: null,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    orderStageID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orderStages',
    },
    orderRequestID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ORDERREQUEST_COLLECTION_NAME,
    },
  },
  {
    timestamps: true,
  },
);
