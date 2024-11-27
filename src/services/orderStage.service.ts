import { Request, Response } from 'express';
import { OrderStageModel } from '../models/orderStage';
import { OrderStageDocument } from '../models/orderStage/orderStage.doc';
import { catchServiceFunc } from '../utils/catchErrors';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { CreateOrderStageRequest } from '../types/http/orderStage.type';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';
import { OrderModel } from '../models/order';
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
  const { name, orderID } = req.body as CreateOrderStageRequest;
  const newOrderStage = await createOne({ name, orderID });
  const newOrder = await OrderModel.findByIdAndUpdate(
    orderID,
    {
      orderStageID: newOrderStage?._id,
    },
    { new: true },
  ).populate({ path: 'orderStageID', populate: { path: 'orderStageStatusID' } });
  return newOrder;
};

const createOne = async ({ name, orderID, expectedDate }: CreateOrderStageRequest) => {
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

export const orderStageService = { findAll, createOne, createOneByRequest, };
