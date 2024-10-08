import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderProps } from '../types/model/order.type';
import { ObjectIDRegex } from '../constants/validation';

interface OrderSchema extends OrderProps {}

const orderSchema = Joi.object<OrderSchema>({
  exprDate: Joi.date().iso(),
  receiverAddress: [Joi.string().trim()],
  note: Joi.string().trim(),
  total: Joi.number().min(0).required(),
  shipmentCost: Joi.number().min(0).required(),
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  storeID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  orderStatusID: Joi.string().regex(ObjectIDRegex, 'valid id'),
  paymentMethodID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const orderValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await orderSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
