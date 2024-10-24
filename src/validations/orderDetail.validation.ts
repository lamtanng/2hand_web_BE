import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderDetailProps } from '../types/model/orderDetail.type';
import { ObjectIDRegex } from '../constants/validation';

interface OrderDetailSchema extends OrderDetailProps {}

const orderDetailSchema = Joi.object<OrderDetailSchema>({
  quantity: Joi.number().min(1).required(),
  priceTotal: Joi.number().min(0).required(),
  productID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  // orderID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const orderDetailValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderDetailSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
