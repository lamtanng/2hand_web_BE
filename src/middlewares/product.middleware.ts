import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { DeleteProductRequestProps } from '../types/http/product.type';

const isInStock = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.query as unknown as DeleteProductRequestProps;
  next();
});

export const cartMiddleware = { isInStock };
