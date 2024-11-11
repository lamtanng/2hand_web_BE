import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';
import { FindAllOrdersResponseProps } from '../types/http/order.type';
import { OrderProps } from '../types/model/order.type';
import { catchErrors } from '../utils/catchErrors';
import { paginationSchema } from './pagination.validation';
import { CommonValidation } from './common.validation';

interface OrderSchema extends OrderProps {}
const { idSchema } = CommonValidation;

const orderSchema = Joi.object<OrderSchema>({
  exprDate: Joi.date().iso(),
  receiverAddress: [Joi.string().trim()],
  note: Joi.string().trim(),
  total: Joi.number().min(0).required(),
  shipmentCost: Joi.number().min(0).required(),
  userID: idSchema.required(),
  storeID: idSchema.required(),
  orderStatusID: idSchema,
  paymentMethodID: idSchema.required(),
  orderDetailIDs: Joi.array().items(idSchema),
});

const findAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: idSchema.empty(''),
  storeID: idSchema.empty(''),
  orderStatusID: idSchema.empty(''),
  paymentMethodID: idSchema.empty(''),
  _id: idSchema.empty(''),
}).concat(paginationSchema);

const customerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: idSchema.required(),
}).concat(findAllSchema);

const sellerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  storeID: idSchema.required(),
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
