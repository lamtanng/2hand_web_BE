import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { PaymentMethodProps } from '../types/model/paymentMethod.type';

interface PaymentMethodSchema extends PaymentMethodProps {}

const paymentMethodSchema = Joi.object<PaymentMethodSchema>({
  name: Joi.string().required(),
});

export const paymentMethodValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await paymentMethodSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
