import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { TaskType } from '../types/enum/taskType.enum';
import { CreateOrderRequestRequest } from '../types/http/orderRequest.type';
import { catchErrors } from '../utils/catchErrors';
import { CommonValidation } from './common.validation';

interface OrderRequestSchema extends CreateOrderRequestRequest {}

const { idSchema } = CommonValidation;

const orderRequestSchema = Joi.object<OrderRequestSchema>({
  description: Joi.string().default(null),
  image: Joi.array().items(Joi.string()).allow(null, ''),
  video: Joi.array().items(Joi.string()).allow(null, ''),
  taskType: Joi.string()
    .valid(...Object.values(TaskType))
    .required(),
  replyStatus: Joi.string()
    .valid(...Object.values(ReplyStatus))
    .default(ReplyStatus.Pending),
  reasonID: idSchema.required(),
  orderStageStatusID: idSchema.required(),
});

export const orderRequestValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await orderRequestSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
