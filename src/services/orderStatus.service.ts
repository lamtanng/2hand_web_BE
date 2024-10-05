import { Request, Response } from 'express';
import { OrderStatusModel } from '../models/orderStatus';
import { OrderStatusDocument } from '../models/orderStatus/orderStatus.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const statuses = await OrderStatusModel.find({});
    return { statuses };
  } catch (error) {
    console.error(error);
  }
};

const addStatus = async (reqBody: OrderStatusDocument, res: Response) => {
  try {
    const orderStatus = reqBody;

    const newOrderStatus = await OrderStatusModel.create(orderStatus);
    return { newOrderStatus };
  } catch (error) {
    console.error(error);
  }
};

export const orderStatusService = { findAll, addStatus };
