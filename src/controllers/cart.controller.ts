import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addCart = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.addCart(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const cartController = {
  findAll,
  addCart,
};
