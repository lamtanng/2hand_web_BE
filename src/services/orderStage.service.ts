import { Request, Response } from 'express';
import { OrderStageModel } from '../models/orderStage';
import { OrderStageDocument } from '../models/orderStage/orderStage.doc';
import { catchServiceFunc } from '../utils/catchErrors';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { CreateOrderStageRequest } from '../types/http/orderStage.type';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';

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
  return newOrderStage;
};

const createOne = async ({ name, orderID }: CreateOrderStageRequest) => {
  try {
    const orderStageStatus = await OrderStageStatusModel.create({
      status: OrderStageStatus.Active,
    });
    const newOrderStage = await OrderStageModel.create({
      name,
      orderStageStatusID: orderStageStatus._id,
      orderID,
    });

    await orderStageStatus.updateOne({ orderStageID: newOrderStage._id });
    return newOrderStage;
  } catch (error: AppError) {
    throw new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const orderStageService = { findAll, createOne, createOneByRequest };
