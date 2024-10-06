import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { reasonService } from '../services/reason.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await reasonService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addReason = catchErrors(async (req: Request, res: Response) => {
  const result = await reasonService.addReason(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const reasonController = {
  findAll,
  addReason,
};
