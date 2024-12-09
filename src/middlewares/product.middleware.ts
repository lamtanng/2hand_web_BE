import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpMessage } from '../constants/httpMessage';
import { OrderDetailModel } from '../models/orderDetail';
import { ProductModel } from '../models/product';
import { OrderStage } from '../types/enum/orderStage.enum';
import { CreateCODPaymentRequestProps } from '../types/http/order.type';
import { DeleteProductRequestProps } from '../types/http/product.type';
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

const isDeleted = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const product = await OrderDetailModel.aggregate([
    {
      $match: {
        productID: new mongoose.Types.ObjectId(req.query._id as string),
      },
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'orderID',
        foreignField: '_id',
        as: 'order',
      },
    },
    {
      $unwind: '$order',
    },
    {
      $lookup: {
        from: 'orderstages',
        localField: 'order.orderStageID',
        foreignField: '_id',
        as: 'order.orderStageID',
      },
    },
    {
      $unwind: '$order.orderStageID',
    },
    {
      $match: {
        'order.orderStageID.name': {
          $nin: [OrderStage.Cancelled, OrderStage.Delivered, OrderStage.Returned],
        },
      },
    },
  ]);

  if (product.length) {
    throw new ApiError({
      message: HttpMessage.PRODUCT_IS_USED,
      statusCode: StatusCodes.BAD_REQUEST,
      data: product,
    });
  }

  next();
});

export const productMiddleware = { isInStock, isDeleted };
