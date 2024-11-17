import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { OrderStageProps } from '../types/model/orderStage.type';

interface OrderStageSchema extends OrderStageProps {}

const orderStageSchema = Joi.object<OrderStageSchema>({
  name: Joi.string().required().trim(),
  stage: Joi.number().min(1),
});

export const orderStageValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await orderStageSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
