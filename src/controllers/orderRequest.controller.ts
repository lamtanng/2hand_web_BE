import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderRequestService } from '../services/orderRequest.service';
import { CreateOrderRequestRequest } from '../types/http/orderRequest.type';
import { OrderStage } from '../types/enum/orderStage.enum';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderRequestService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addOrderRequest = catchErrors(async (req: Request, res: Response) => {
  const { name } = req.body as CreateOrderRequestRequest;
  const result = await orderRequestService.addOrderRequest(req, res);
  if (name === OrderStage.Confirmating) {
  }
  res.status(StatusCodes.OK).json(result).send();
});

const replyByRequest = catchErrors(async (req: Request, res: Response) => {
  const result = await orderRequestService.replyByRequest(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderRequestController = {
  findAll,
  addOrderRequest,
  replyByRequest,
};
