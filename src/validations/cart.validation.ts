import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { CartProps } from '../types/model/cart.type';
import { CartItemProps } from '../types/model/cartItem.type';
import { ObjectIDRegex } from '../constants/validation';

interface CartSchema extends CartProps {}
interface CartItemSchema extends CartItemProps {}

const cartSchema = Joi.object<CartSchema>({
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  items: Joi.object<CartItemSchema>({
    productID: Joi.string().regex(ObjectIDRegex, 'valid id'),
    quantity: Joi.number().min(1),
  }),
});

export const cartValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await cartSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
