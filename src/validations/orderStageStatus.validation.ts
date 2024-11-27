import Joi from 'joi';
import { OrderStageStatusProps } from '../types/model/orderStageStatus.type';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { CommonValidation } from './common.validation';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';
import {
  CreateOrderStageStatusRequest,
  UpdateDateRequest,
} from '../types/http/orderStageStatus.type';

interface CreateOrderStageStatusSchema extends CreateOrderStageStatusRequest {}
interface UpdateDateSchema extends UpdateDateRequest {}

const { idSchema } = CommonValidation;

const createOrderStageStatusSchema = Joi.object<CreateOrderStageStatusSchema>().keys({
  status: Joi.string()
    .required()
    .valid(...Object.values(OrderStageStatus)),
  orderRequestID: idSchema.allow(null, ''),
  orderStageID: idSchema.required(),
  date: Joi.date(),
  expectedDate: Joi.date(),
  
});

const updateDateSchema = Joi.object<UpdateDateSchema>().keys({
  _id: idSchema.required(),
  date: Joi.date().required(),
});

const createValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await createOrderStageStatusSchema.validateAsync(req.body, { abortEarly: true });
  next();
});

const updateDateValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await updateDateSchema.validateAsync(req.body, { abortEarly: true });
  next();
});

export const orderStageStatusValidation = { createValidation, updateDateValidation };
