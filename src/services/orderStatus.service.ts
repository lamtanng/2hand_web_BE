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

    const lastStatus = await OrderStatusModel.findOne()
      .sort({ stage: -1 })
      .limit(1);
    // Increment the stage for the new status
    if (lastStatus) {
      orderStatus.stage = lastStatus.stage + 1; // Increment stage
    } else {
      orderStatus.stage = 1; // Start from 1 if no status exist
    }

    const newOrderStatus = await OrderStatusModel.create(orderStatus);
    return { newOrderStatus };
  } catch (error) {
    console.error(error);
  }
};

export const orderStatusService = { findAll, addStatus };
