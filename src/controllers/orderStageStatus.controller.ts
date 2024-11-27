import { StatusCodes } from 'http-status-codes';
import { orderStageStatusService } from '../services/orderStageStatus.service';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';

const createOne = catchErrors(async (req: Request, res: Response) => {
  const result = await orderStageStatusService.createOneByRequest(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateDate = catchErrors(async (req: Request, res: Response) => {
  const result = await orderStageStatusService.updateDate(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderStageStatusController = { createOne, updateDate };
