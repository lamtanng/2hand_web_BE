import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderStageService } from '../services/orderStage.service';
import { orderStageStatusService } from '../services/orderStageStatus.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderStageService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addStatus = catchErrors(async (req: Request, res: Response) => {
  const orderStageStatus = await orderStageStatusService.createOne(req, res);
  const result = await orderStageService.createOneByRequest(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderStageController = {
  findAll,
  addStatus,
};
