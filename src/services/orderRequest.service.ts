import { Request, Response } from 'express';
import { OrderRequestModel } from '../models/orderRequest';
import {
  CreateOrderRequestRequest,
  ReplyOrderRequestRequest,
} from '../types/http/orderRequest.type';
import { catchServiceFunc } from '../utils/catchErrors';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { OrderModel } from '../models/order';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { orderStageService } from './orderStage.service';
import { OrderStage } from '../types/enum/orderStage.enum';
import { OrderRequestDocument } from '../models/orderRequest/orderRequest.doc';
import mongoose from 'mongoose';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const orderRequests = await OrderRequestModel.find({});
    return { orderRequests };
  } catch (error) {
    console.error(error);
  }
};

const addOrderRequest = catchServiceFunc(async (req: Request, res: Response) => {
  const orderRequest = req.body as CreateOrderRequestRequest;
  const newOrderRequest = await OrderRequestModel.create(orderRequest);
  await OrderStageStatusModel.findByIdAndUpdate(orderRequest.orderStageStatusID, {
    orderRequestID: newOrderRequest._id,
  });
  return newOrderRequest;
});

const reply = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, replyMessage, replyStatus } = req.body as ReplyOrderRequestRequest;
  const repliedOrderRequest = (await OrderRequestModel.findByIdAndUpdate(
    _id,
    { replyMessage, replyStatus },
    { new: true },
  ).populate({ path: 'orderStageStatusID', populate: { path: 'orderStageID' } })) as
    | (OrderRequestDocument & { orderStageStatusID: { orderStageID: { orderID: string } } })
    | null;

  // if approved, move order to the cancelled stage
  if (replyStatus === ReplyStatus.Succeeded) {
    const orderID = repliedOrderRequest?.orderStageStatusID?.orderStageID
      ?.orderID as unknown as mongoose.Types.ObjectId;

    const orderStage = await orderStageService.createOne({
      name: OrderStage.Cancelled,
      orderID,
    });

    //update order with new orderStage
    await OrderModel.findByIdAndUpdate(
      orderID,
      { orderStageID: orderStage?._id },
      { new: true },
    ).populate({
      path: 'orderStageID',
      populate: { path: 'orderStageStatusID', populate: 'orderRequestID' },
    });
  }
  return repliedOrderRequest;
});

export const orderRequestService = { findAll, addOrderRequest, reply };
