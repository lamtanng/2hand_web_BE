import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { productService } from '../services/product.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addProduct = catchErrors(async (req: Request, res: Response) => {
  const result = await productService.addProduct(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const productController = {
  findAll,
  addProduct,
};
