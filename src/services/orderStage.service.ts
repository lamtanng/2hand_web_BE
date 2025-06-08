import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotificationModel } from '../models/notification';
import { OrderModel } from '../models/order';
import { OrderStageModel } from '../models/orderStage';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';
import { AppError } from '../types/error.type';
import { CreateOrderStageRequest } from '../types/http/orderStage.type';
import { NotificationType } from '../types/model/notification.type';
import ApiError from '../utils/classes/ApiError';
import { NOTIFICATION_CONTENT } from '../utils/notificationHelper';
import { orderStageStatusService } from './orderStageStatus.service';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const statuses = await OrderStageModel.find({});
    return { statuses };
  } catch (error) {
    console.error(error);
  }
};

const createOneByRequest = async (req: Request, res: Response) => {
  const { name, orderID, orderStageStatusID, expectedDate } = req.body as CreateOrderStageRequest;

  //update date of current order status
  await OrderStageStatusModel.findByIdAndUpdate(orderStageStatusID, { date: new Date() });

  const newOrderStage = await createOne({ name, orderID, expectedDate });
  const newOrder = await OrderModel.findByIdAndUpdate(
    orderID,
    {
      orderStageID: newOrderStage?._id,
    },
    { new: true },
  ).populate({ path: 'orderStageID', populate: { path: 'orderStageStatusID' } });

  if (!newOrder) {
    throw new ApiError({ message: 'Order not found', statusCode: StatusCodes.NOT_FOUND });
  }

  await NotificationModel.create({
    type: NotificationType.Order,
    title: NOTIFICATION_CONTENT.Order?.[name]?.title,
    content: NOTIFICATION_CONTENT.Order?.[name]?.content(newOrder?._id || ''),
    receiver: newOrder?.userID,
    relatedId: newOrder?._id,
  });

  return newOrder;
};

const createOne = async ({
  name,
  orderID,
  expectedDate,
}: Omit<CreateOrderStageRequest, 'orderStageStatusID'>) => {
  try {
    const orderStage = await OrderStageModel.create({
      name,
      orderID,
    });
    const orderStageStatus = await orderStageStatusService.createOne({
      orderStageID: orderStage._id,
      status: OrderStageStatus.Active,
      expectedDate,
    });

    return await OrderStageModel.findByIdAndUpdate(orderStage._id, {
      orderStageStatusID: orderStageStatus?._id,
    });
  } catch (error: AppError) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const orderStageService = { findAll, createOne, createOneByRequest };
