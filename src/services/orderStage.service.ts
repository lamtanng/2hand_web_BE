import { Request, Response } from 'express';
import { OrderStageModel } from '../models/orderStage';
import { OrderStageDocument } from '../models/orderStage/orderStage.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const statuses = await OrderStageModel.find({});
    return { statuses };
  } catch (error) {
    console.error(error);
  }
};

const addStatus = async (reqBody: OrderStageDocument, res: Response) => {
  try {
    const orderStage = reqBody;

    const lastStatus = await OrderStageModel.findOne().sort({ stage: -1 }).limit(1);
    // Increment the stage for the new status
    // if (lastStatus) {
    //   orderStage.stage = lastStatus.stage + 1; // Increment stage
    // } else {
    //   orderStage.stage = 1; // Start from 1 if no status exist
    // }

    const newOrderStage = await OrderStageModel.create(orderStage);
    return { newOrderStage };
  } catch (error) {
    console.error(error);
  }
};

export const orderStageService = { findAll, addStatus };
