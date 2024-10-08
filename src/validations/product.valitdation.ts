import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { ProductProps } from '../types/model/product.type';
import { ProductQuality } from '../types/enum/productQuality.enum';
import { ObjectIDRegex } from '../constants/validation';

interface ProductSchema extends ProductProps {}

const productSchema = Joi.object<ProductSchema>({
  name: Joi.string().required().trim(),
  description: Joi.string().trim(),
  image: [Joi.string()],
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(1).required(),
  quality: Joi.string().valid(ProductQuality).required().trim(),
  slug: Joi.string(),
  isActive: Joi.boolean().default(true),
  isSoldOut: Joi.boolean().default(false),
  cateID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  storeID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const productValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await productSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
