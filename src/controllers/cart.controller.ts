import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { cartService } from '../services/cart.service';
import { catchErrors } from '../utils/catchErrors';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneItem = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.findOneItem(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addCartItem = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.addCartItem(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const removeCartItem = catchErrors(async (req: Request, res: Response) => {
  const result = await cartService.removeCartItem(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const cartController = {
  findAll,
  addCartItem,
  removeCartItem,
  findOneItem,
};
