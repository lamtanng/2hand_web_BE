import Joi, { string } from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderRequestProps } from '../types/model/orderRequest.type';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { TaskType } from '../types/enum/taskType.enum';
import { ObjectIDRegex } from '../constants/validation';
import { CommonValidation } from './common.validation';

interface OrderRequestSchema extends OrderRequestProps {}

const { idSchema } = CommonValidation;

const orderRequestSchema = Joi.object<OrderRequestSchema>({
  description: Joi.string().default(null),
  image: [Joi.string()],
  video: [Joi.string()],
  task: Joi.string().valid(TaskType.Cancel, TaskType.Return).required(),
  replyStatus: Joi.string().valid(ReplyStatus).default(ReplyStatus.Pending),
  replyMessage: Joi.string().default(null),
  reasonID: idSchema.required(),
  orderStageStatusID: idSchema.required(),
});

export const orderRequestValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await orderRequestSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
