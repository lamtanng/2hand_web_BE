import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderService } from '../services/order.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addOrder = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.addOrder(req, res);
  res.status(StatusCodes.OK).json(result).send('<p>some html</p>');
});

const updateOrderStatus = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.updateOrderStatus(req, res);
  res.status(StatusCodes.OK).json(result).send('<p>some html</p>');
});

const payByMomo = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.payByMomo(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const checkPaymentTransaction = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.checkPaymentTransaction(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderController = {
  findAll,
  addOrder,
  payByMomo,
  checkPaymentTransaction,
  updateOrderStatus,
};
