import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { reasonService } from '../services/reason.service';
import { log } from 'console';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await reasonService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const createReason = catchErrors(async (req: Request, res: Response) => {
  const result = await reasonService.createReason(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateReason = catchErrors(async (req: Request, res: Response) => {
  const result = await reasonService.updateReason(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const reasonController = {
  findAll,
  createReason,
  updateReason,
};
