import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';
import { ProductQuality } from '../types/enum/productQuality.enum';
import { ProductProps } from '../types/model/product.type';
import { catchErrors } from '../utils/catchErrors';
import { addressValidation } from './address.validation';
import { CommonValidation } from './common.validation';

interface ProductSchema extends Omit<ProductProps, '_id'> {}
interface UpdateProductSchema extends ProductProps {}

const { idSchema } = CommonValidation;

const productSchema = Joi.object<ProductSchema>({
  name: Joi.string().required().trim(),
  description: Joi.string().trim(),
  image: Joi.array().items(Joi.string()).allow(null, ''),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(1).required(),
  quality: Joi.string()
    .valid(...Object.values(ProductQuality))
    .required()
    .trim(),
  slug: Joi.string(),
  isActive: Joi.boolean().default(true),
  isPublish: Joi.boolean().default(true),
  cateID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  storeID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  weight: Joi.number().min(0).required(),
  height: Joi.number().min(0).required(),
  width: Joi.number().min(0).required(),
  length: Joi.number().min(0).required(),
  address: addressValidation.addressSchema,
  isApproved: Joi.boolean().default(false),
});

const updateProductSchema = productSchema.append<UpdateProductSchema>({
  _id: idSchema.required(),
});

const createProductValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await productSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
const updateProductValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await updateProductSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const productValidation = { createProductValidation, updateProductValidation };
