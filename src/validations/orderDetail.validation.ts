import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderDetailProps } from '../types/model/orderDetail.type';
import { ObjectIDRegex } from '../constants/validation';
import { CreateOrderDetailRequest } from '../types/http/orderDetails.type';
import { CommonValidation } from './common.validation';

interface CreateOrderDetailSchema extends CreateOrderDetailRequest {}

const { idSchema } = CommonValidation;
const orderDetailSchema = Joi.object<CreateOrderDetailSchema>().keys({
  quantity: Joi.number().min(1).required(),
  priceTotal: Joi.number().min(0).required(),
  productID: idSchema.required(),
  orderID: idSchema.required(),
});

export const orderDetailValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderDetailSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
