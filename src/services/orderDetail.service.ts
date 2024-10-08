import { Request, Response } from 'express';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderDetailProps } from '../types/model/orderDetail.type';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const orderDetails = await OrderDetailModel.find({});
    return { orderDetails };
  } catch (error) {
    console.error(error);
  }
};

const addOrderDetail = async (reqBody: OrderDetailProps, res: Response) => {
  try {
    const orderDetail = reqBody;

    const newOderDetail = await OrderDetailModel.create(orderDetail);
    return { newOderDetail };
  } catch (error) {
    console.error(error);
  }
};

export const orderDetailService = { findAll, addOrderDetail };
