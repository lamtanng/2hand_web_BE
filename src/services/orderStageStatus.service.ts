import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { OrderStageStatusProps } from '../types/model/orderStageStatus.type';

const createOne = catchServiceFunc(async (req: Request, res: Response) => {
  const data = req.body as OrderStageStatusProps;
  const result = await OrderStageStatusModel.create(data);
  return result;
});

export const orderStageStatusService = { createOne };
