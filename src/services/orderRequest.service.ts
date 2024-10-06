import { Request, Response } from 'express';
import { OrderRequestModel } from '../models/orderRequest';
import { OrderRequestDocument } from '../models/orderRequest/orderRequest.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const orderRequests = await OrderRequestModel.find({});
    return { orderRequests };
  } catch (error) {
    console.error(error);
  }
};

const addOrderRequest = async (reqBody: OrderRequestDocument, res: Response) => {
  try {
    const orderRequest = reqBody;

    const newOrderRequest = await OrderRequestModel.create(orderRequest);
    return { newOrderRequest };
  } catch (error) {
    console.error(error);
  }
};

export const orderRequestService = { findAll, addOrderRequest };
