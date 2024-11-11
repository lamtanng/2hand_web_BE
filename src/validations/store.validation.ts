import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { StoreProps } from '../types/model/store.type';
import { ObjectIDRegex } from '../constants/validation';
import { addressValidation } from './address.validation';
import { CreateStoreRequestProps } from '../types/http/store.type';

interface StoreSchema extends StoreProps {}
interface CreateStoreSchema extends CreateStoreRequestProps {}

const { addressSchema } = addressValidation;

const storeSchema = Joi.object<StoreSchema>({
  name: Joi.string().required().trim(),
  slug: Joi.string(),
  description: Joi.string().trim(),
  address: Joi.array().items(addressSchema),
  avatar: Joi.string(),
  coverImg: Joi.string(),
  isActive: Joi.boolean().default(true),
  userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

const createStoreSchema = storeSchema.append<CreateStoreSchema>({
  phoneNumber: Joi.string().allow(null, ''),
});

export const createStoreValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await createStoreSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const storeValidation = {
  createStoreValidation,
};
