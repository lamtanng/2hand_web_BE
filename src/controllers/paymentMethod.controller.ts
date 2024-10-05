import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { paymentMethodService } from '../services/paymentMethod.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await paymentMethodService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addMethod = catchErrors(async (req: Request, res: Response) => {
  const result = await paymentMethodService.addMethod(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const paymentMethodController = {
  findAll,
  addMethod,
};
