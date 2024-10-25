import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';
import { FindAllOrdersResponseProps } from '../types/http/order.type';
import { OrderProps } from '../types/model/order.type';
import { catchErrors } from '../utils/catchErrors';
import { paginationSchema } from './pagination.validation';

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
  orderDetailIDs: Joi.array().items(Joi.string().regex(ObjectIDRegex, 'valid id')),
});

const findAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').empty(''),
  storeID: Joi.string().regex(ObjectIDRegex, 'valid id').empty(''),
  orderStatusID: Joi.string().regex(ObjectIDRegex, 'valid id').empty(''),
  paymentMethodID: Joi.string().regex(ObjectIDRegex, 'valid id').empty(''),
  _id: Joi.string().regex(ObjectIDRegex, 'valid id').empty(''),
}).concat(paginationSchema);

const customerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
}).concat(findAllSchema);

const sellerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  storeID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
}).concat(findAllSchema);

const createOrder = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await orderSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const customerFindAll = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await customerFindAllSchema.validateAsync(req.query, { abortEarly: false });
  next();
});

const sellerFindAll = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await sellerFindAllSchema.validateAsync(req.query, { abortEarly: false });
  next();
});

export const orderValidation = { createOrder, customerFindAll, sellerFindAll };
