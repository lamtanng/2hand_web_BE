import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderRequestService } from '../services/orderRequest.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderRequestService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addOrderRequest = catchErrors(async (req: Request, res: Response) => {
  const result = await orderRequestService.addOrderRequest(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const reply = catchErrors(async (req: Request, res: Response) => {
  const result = await orderRequestService.reply(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderRequestController = {
  findAll,
  addOrderRequest,
  reply,
};
