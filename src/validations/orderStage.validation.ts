import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CreateOrderStageRequest } from '../types/http/orderStage.type';
import { catchErrors } from '../utils/catchErrors';
import { CommonValidation } from './common.validation';
import { OrderStage } from '../types/enum/orderStage.enum';

interface OrderStageSchema extends CreateOrderStageRequest {}

const { idSchema } = CommonValidation;

const orderStageSchema = Joi.object<OrderStageSchema>({
  name: Joi.string()
    .required()
    .trim()
    .valid(...Object.values(OrderStage)),
  orderID: idSchema.required(),
  expectedDate: Joi.date().iso(),
});

export const orderStageValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderStageSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
