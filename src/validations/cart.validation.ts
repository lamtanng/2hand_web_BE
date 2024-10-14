import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';
import { CartProps } from '../types/model/cart.type';
import { CartItemProps } from '../types/model/cartItem.type';
import { catchErrors } from '../utils/catchErrors';

interface CartSchema extends CartProps {}
interface CartItemSchema extends CartItemProps {}

const cartSchema = Joi.object<CartSchema>({
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required().trim(),
  items: Joi.array<CartItemSchema[]>().items({
    productID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
    quantity: Joi.number().min(1).required(),
  }),
});

export const cartValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await cartSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
