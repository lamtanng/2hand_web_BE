import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ProductModel } from '../models/product';
import { CartProps } from '../types/model/cart.type';
import { catchErrors } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { HttpMessage } from '../constants/httpMessage';

const isInStock = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {
    items: [{ productID, quantity }],
  } = req.body as CartProps;

  const isInStock = await ProductModel.findOne({
    _id: productID,
    quantity: { $gte: quantity },
  });

  if (!isInStock)
    throw new ApiError({
      message: HttpMessage.OUT_OF_STOCK,
      statusCode: StatusCodes.BAD_REQUEST,
    });

  next();
});

export const cartMiddleware = { isInStock };
