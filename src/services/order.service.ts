import { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { OrderDocument } from '../models/order/order.doc';
import { OrderStatusModel } from '../models/orderStatus';
import { StatusCodes } from 'http-status-codes';

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

    const orderStatus = await OrderStatusModel.findOne({stage: 1});
    if (!orderStatus){
        res.status(StatusCodes.NOT_FOUND);
        return;
    } else{
        order.orderStatusID = orderStatus._id;
    }

    const newOrder = await OrderModel.create(order);
    return { newOrder };
  } catch (error) {
    console.error(error);
  }
};

export const orderService = { findAll, addOrder };
