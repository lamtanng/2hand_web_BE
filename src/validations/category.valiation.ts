import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { CategoryProps } from '../types/model/category.type';
import { ObjectIDRegex } from '../constants/validation';
import { AddCategoryRequestProps } from '../types/http/category.type';

interface CategorySchema extends CategoryProps {}
interface AddCategorySchema extends AddCategoryRequestProps {}

const categorySchema = Joi.object<CategorySchema>({
  name: Joi.string().required().trim(),
  isActive: Joi.boolean().default(true),
  parentID: Joi.string().regex(ObjectIDRegex, 'valid id'),
});
const addCategorySchema = Joi.object<AddCategorySchema>({
  name: Joi.string().required().trim(),
  parentID: Joi.string().regex(ObjectIDRegex, 'valid id').allow(null, ''),
  image: Joi.string().allow(null, ''),
});

const addCategoryValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await addCategorySchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const categoryValidation = { addCategoryValidation };
