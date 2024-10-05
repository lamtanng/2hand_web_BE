import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderStatusService } from '../services/orderStatus.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderStatusService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addStatus = catchErrors(async (req: Request, res: Response) => {
  const result = await orderStatusService.addStatus(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderStatusController = {
  findAll,
  addStatus,
};
