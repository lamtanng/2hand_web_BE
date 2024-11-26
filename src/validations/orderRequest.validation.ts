import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { TaskType } from '../types/enum/taskType.enum';
import {
  CreateOrderRequestRequest,
  ReplyOrderRequestRequest,
} from '../types/http/orderRequest.type';
import { catchErrors } from '../utils/catchErrors';
import { CommonValidation } from './common.validation';
import { OrderStage } from '../types/enum/orderStage.enum';
import { OrderStageStatus } from '../types/enum/orderStageStatus.enum';

interface OrderRequestSchema extends CreateOrderRequestRequest {}
interface ReplyOrderRequestSchema extends ReplyOrderRequestRequest {}

const { idSchema } = CommonValidation;

const orderRequestSchema = Joi.object<OrderRequestSchema>({
  description: Joi.string().default(null),
  image: Joi.array().items(Joi.string()).allow(null, ''),
  video: Joi.array().items(Joi.string()).allow(null, ''),
  taskType: Joi.string()
    .valid(...Object.values(TaskType))
    .required(),
  reasonID: idSchema.required(),
  orderStageID: idSchema.required(),
  name: Joi.string().required().valid(OrderStage.Picking, OrderStage.Confirmating),
  status: Joi.string()
    .valid(...Object.values(OrderStageStatus))
    .required(),
});

const replyOrderRequestSchema = Joi.object<ReplyOrderRequestSchema>().keys({
  _id: idSchema.required(),
  replyMessage: Joi.string().required(),
  replyStatus: Joi.string().valid(ReplyStatus.Succeeded, ReplyStatus.Rejected).required(),
});

const createValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await orderRequestSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const replyValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await replyOrderRequestSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const orderRequestValidation = {
  createValidation,
  replyValidation,
};
