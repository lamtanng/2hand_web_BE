import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { CategoryProps } from '../types/model/category.type';
import { ObjectIDRegex } from '../constants/validation';
import { AddCategoryRequestProps, UpdateCategoryRequestProps } from '../types/http/category.type';
import { CommonValidation } from './common.validation';

interface UpdateCategorySchema extends UpdateCategoryRequestProps {}
interface AddCategorySchema extends AddCategoryRequestProps {}

const { idSchema } = CommonValidation;

const addCategorySchema = Joi.object<AddCategorySchema>({
  name: Joi.string().required().trim(),
  parentID: Joi.string().regex(ObjectIDRegex, 'valid id').allow(null, ''),
  image: Joi.string().allow(null, ''),
});
const updateCategorySchema = addCategorySchema.append<UpdateCategorySchema>({
  _id: idSchema.required(),
  slug: Joi.string().allow(null, ''),
  isActive: Joi.boolean().required(),
});

const addCategoryValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await addCategorySchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const updateCategoryValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await updateCategorySchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const categoryValidation = { addCategoryValidation, updateCategoryValidation };
