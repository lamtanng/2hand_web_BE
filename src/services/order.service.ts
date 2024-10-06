import { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { OrderDocument } from '../models/order/order.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const orders = await OrderModel.find({});
    return { orders };
  } catch (error) {
    console.error(error);
  }
};

const addOrder = async (reqBody: OrderDocument, res: Response) => {
  try {
    const order = reqBody;

    const newOrder = await OrderModel.create(order);
    return { newOrder };
  } catch (error) {
    console.error(error);
  }
};

export const orderService = { findAll, addOrder };
