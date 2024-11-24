import { Request, Response } from 'express';
import { OrderRequestModel } from '../models/orderRequest';
import {
  CreateOrderRequestRequest,
  ReplyOrderRequestRequest,
} from '../types/http/orderRequest.type';
import { catchServiceFunc } from '../utils/catchErrors';

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

const reply = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, replyMessage, replyStatus } = req.body as ReplyOrderRequestRequest;
  const repliedOrderRequest = await OrderRequestModel.findByIdAndUpdate(
    _id,
    { replyMessage, replyStatus },
    { new: true },
  );
  return repliedOrderRequest;
});

export const orderRequestService = { findAll, addOrderRequest, reply };
