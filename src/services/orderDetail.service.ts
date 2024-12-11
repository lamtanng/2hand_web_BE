import { Request, Response } from 'express';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderDetailProps } from '../types/model/orderDetail.type';
import { catchServiceFunc } from '../utils/catchErrors';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const orderDetails = await OrderDetailModel.find({});
    return { orderDetails };
  } catch (error) {
    console.error(error);
  }
};

const addOrderDetail = catchServiceFunc(async (req: Request, res: Response) => {
  const orderDetail = req.body;
  const newOderDetail = await OrderDetailModel.create(orderDetail);
  return newOderDetail;
});

export const orderDetailService = { findAll, addOrderDetail };
