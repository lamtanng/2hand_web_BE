import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderDetailService } from '../services/orderDetail.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderDetailService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addOrderDetail = catchErrors(async (req: Request, res: Response) => {
  const result = await orderDetailService.addOrderDetail(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderDetailController = {
  findAll,
  addOrderDetail,
};
