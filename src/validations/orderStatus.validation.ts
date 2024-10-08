import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderStatusProps } from '../types/model/orderStatus.type';

interface OrderStatusSchema extends OrderStatusProps {}

const orderStatusSchema = Joi.object<OrderStatusSchema>({
  name: Joi.string().required().trim(),
  stage: Joi.number().min(1),
});

export const orderStatusValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await orderStatusSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
