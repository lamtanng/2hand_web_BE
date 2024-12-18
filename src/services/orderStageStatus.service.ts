import { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { OrderStageModel } from '../models/orderStage';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { AppError } from '../types/error.type';
import {
  CreateOrderStageStatusRequest,
  UpdateDateRequest,
} from '../types/http/orderStageStatus.type';
import { OrderStageStatusProps } from '../types/model/orderStageStatus.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';

const createOneByRequest = catchServiceFunc(async (req: Request, res: Response) => {
  const data = req.body as OrderStageStatusProps;
  const orderStageStatus = await createOne(data);

  const newOrder = await OrderModel.findOne(
    { orderStageID: orderStageStatus.orderStageID },
    { new: true },
  ).populate({ path: 'orderStageID', populate: { path: 'orderStageStatusID' } });
  return newOrder;
});

const createOne = async (data: CreateOrderStageStatusRequest) => {
  try {
    const status = await OrderStageStatusModel.create(data);
    const orderStage = await OrderStageModel.findByIdAndUpdate(data.orderStageID, {
      orderStageStatusID: status._id,
    });
    return status;
  } catch (error: AppError) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const updateDate = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, date } = req.body as UpdateDateRequest;
  const status = await OrderStageStatusModel.findByIdAndUpdate(_id, { date }, { new: true });
  return status;
});

export const orderStageStatusService = { createOne, createOneByRequest, updateDate };
