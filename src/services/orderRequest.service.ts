import { Request, Response } from 'express';
import { OrderRequestModel } from '../models/orderRequest';
import { CreateOrderRequestRequest } from '../types/http/orderRequest.type';
import { catchServiceFunc } from '../utils/catchErrors';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { TaskType } from '../types/enum/taskType.enum';
import { ObjectType } from '../types/enum/objectType.enum';

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
  return newOrderRequest;
});

export const orderRequestService = { findAll, addOrderRequest };
