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
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';
import { orderStageStatusService } from './orderStageStatus.service';
import { TaskType } from '../types/enum/taskType.enum';
import { ProductModel } from '../models/product';
import { OrderProps } from '../types/model/order.type';
import { OrderDetailProps } from '../types/model/orderDetail.type';

interface UpdatedOrderResponse extends Omit<OrderProps, 'orderDetailIDs'> {
  orderDetailIDs: OrderDetailProps[];
}

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
  const { status, name } = orderRequest;

  //create new order stage status ()
  let newOrderStageStatus;
  if (status === OrderStageStatus.RequestToSeller) {
    newOrderStageStatus = await orderStageStatusService.createOne({
      orderStageID: orderRequest.orderStageID,
      status: OrderStageStatus.RequestToAdmin,
    });
  } else if (status === OrderStageStatus.Active) {
    newOrderStageStatus = await orderStageStatusService.createOne({
      orderStageID: orderRequest.orderStageID,
      status: OrderStageStatus.RequestToSeller,
    });
  }

  //create new order request
  const newOrderRequest = await OrderRequestModel.create({
    ...orderRequest,
    orderStageStatusID: newOrderStageStatus?._id,
  });

  //update orderStageStatusID in orderStage
  await OrderStageStatusModel.findByIdAndUpdate(newOrderStageStatus?._id, {
    orderRequestID: newOrderRequest._id,
  });

  //auto approved request if stage is Confirmating
  if (name === OrderStage.Confirmating) {
    console.log('auto approved request', name);

    await reply({
      _id: newOrderRequest?._id,
      replyStatus: ReplyStatus.Succeeded,
      replyMessage: 'Approved',
    });
  }

  return newOrderRequest;
});

const replyByRequest = catchServiceFunc(async (req: Request, res: Response) => {
  const data = req.body as ReplyOrderRequestRequest;
  const repliedOrderRequest = await reply({ ...data });
  return repliedOrderRequest;
});

const reply = async ({ _id, replyStatus, replyMessage }: ReplyOrderRequestRequest) => {
  try {
    //update request status (rejected or succeeded)
    const repliedOrderRequest = (await OrderRequestModel.findByIdAndUpdate(
      _id,
      { replyMessage, replyStatus },
      { new: true },
    ).populate({ path: 'orderStageStatusID', populate: { path: 'orderStageID' } })) as
      | (OrderRequestDocument & { orderStageStatusID: { orderStageID: { orderID: string } } })
      | null;

    const orderID = repliedOrderRequest?.orderStageStatusID?.orderStageID
      ?.orderID as unknown as mongoose.Types.ObjectId;

    //if request is succeeded, cancel order
    if (replyStatus === ReplyStatus.Succeeded) {
      await cancelOrder(orderID, repliedOrderRequest?.taskType || TaskType.Cancel);
    }

    //if request is rejected
    if (replyStatus === ReplyStatus.Rejected) {
      await OrderRequestModel.findByIdAndUpdate(
        repliedOrderRequest?._id,
        {
          replyStatus: ReplyStatus.Rejected,
        },
        { new: true },
      );
    }

    return repliedOrderRequest;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const cancelOrder = async (orderID: mongoose.Types.ObjectId, taskType: TaskType) => {
  try {
    let stage = OrderStage.Cancelled;
    if (taskType === TaskType.Return) stage = OrderStage.Returned;

    const orderStage = await orderStageService.createOne({
      name: stage,
      orderID,
    });
    
    //update order with new orderStage
    const updatedOrder = (await OrderModel.findByIdAndUpdate(
      orderID,
      { orderStageID: orderStage?._id },
      { new: true },
    ).populate('orderDetailIDs')) as unknown as UpdatedOrderResponse;
    
    //update quantity of product
    await ProductModel.bulkWrite(
      updatedOrder?.orderDetailIDs.map((order) => ({
        updateOne: {
          filter: { _id: order.productID },
          update: {
            $inc: { quantity: order.quantity },
          },
        },
      })),
    );

    return updatedOrder;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const orderRequestService = { findAll, addOrderRequest, replyByRequest, reply };
