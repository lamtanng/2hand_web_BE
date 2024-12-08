import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { ProductModel } from '../models/product';
import { CreateCODPaymentRequestProps } from '../types/http/order.type';
import { catchErrors } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';

const isInStock = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { orders } = req.body as CreateCODPaymentRequestProps;

  const allProducts = orders.flatMap((order) =>
    order.items.map(({ id, name }) => ({ _id: id, name })),
  );
  const inStockProducts = await ProductModel.find({
    _id: { $in: allProducts.map(({ _id }) => _id) },
  });

  const outOfStockProducts = allProducts.filter(({ _id }) => {
    return !inStockProducts.some((product) => String(product._id) === _id && product.quantity > 0);
  });

  if (outOfStockProducts?.length) {
    throw new ApiError({
      message: HttpMessage.OUT_OF_STOCK,
      statusCode: StatusCodes.NOT_FOUND,
      data: outOfStockProducts,
    });
  }
  next();
});

export const productMiddleware = { isInStock };
