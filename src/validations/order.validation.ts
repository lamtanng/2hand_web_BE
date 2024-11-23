import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';
import {
  CreateCODPaymentRequestProps,
  CreatedOrderProps,
  FindAllOrdersResponseProps,
} from '../types/http/order.type';
import { OrderProps } from '../types/model/order.type';
import { catchErrors } from '../utils/catchErrors';
import { paginationSchema } from './pagination.validation';
import { CommonValidation } from './common.validation';
import { MoMoPaymentItemsProps } from '../types/http/momoPayment.type';

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
  orderStageID: idSchema.required(),
  paymentMethodID: idSchema.required(),
  orderDetailIDs: Joi.array().items(idSchema),
});

const findAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: idSchema.empty(''),
  storeID: idSchema.empty(''),
  orderStageID: idSchema.empty(''),
  paymentMethodID: idSchema.empty(''),
  _id: idSchema.empty(''),
}).concat(paginationSchema);

const customerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  userID: idSchema.required(),
}).concat(findAllSchema);

const sellerFindAllSchema = Joi.object<FindAllOrdersResponseProps>({
  storeID: idSchema.required(),
}).concat(findAllSchema);

const placeOrderSchema = Joi.object<CreateCODPaymentRequestProps>({
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  total: Joi.number().min(0).required(),
  paymentMethodID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  // receiverAddress: Joi.string().trim().required(),
  orders: Joi.array().items(
    Joi.object<CreatedOrderProps>({
      storeID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
      total: Joi.number().min(0).required(),
      note: Joi.string().trim(),
      shipmentCost: Joi.number().min(0).required(),
      items: Joi.array().items(
        Joi.object<MoMoPaymentItemsProps>({
          id: Joi.string().required(),
          name: Joi.string().required(),
          price: Joi.number().min(0).required(),
          // currency: Joi.string().valid('VND').required(),
          quantity: Joi.number().min(0).required(),
          totalPrice: Joi.number().min(0).required(),
          description: Joi.string().trim(),
          category: Joi.string().trim(),
          imageUrl: Joi.string().trim(),
          manufacturer: Joi.string().trim(),
          unit: Joi.string().trim(),
          taxAmount: Joi.number().min(0),
        }),
      ),
    }),
  ),
});

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
