import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { StoreProps } from '../types/model/store.type';
import { ObjectIDRegex } from '../constants/validation';
import { addressValidation } from './address.validation';
import { CreateStoreRequestProps, UpdateStoreRequestProps } from '../types/http/store.type';
import { CommonValidation } from './common.validation';

interface StoreSchema extends StoreProps {}
interface CreateStoreSchema extends CreateStoreRequestProps {}
interface UpdateStoreRequestSchema extends UpdateStoreRequestProps {}

const { addressSchema } = addressValidation;
const { idSchema } = CommonValidation;

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

const updateStoreSchema = Joi.object<UpdateStoreRequestSchema>().keys({
  _id: idSchema.required(),
  address: Joi.array().items(addressSchema),
  avatar: Joi.string().allow(null, ''),
  coverImg: Joi.string().allow(null, ''),
  description: Joi.string().trim().allow(null, ''),
  name: Joi.string().trim().allow(null, ''),
});

export const createStoreValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await createStoreSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const updateValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  console.log();
  await updateStoreSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const storeValidation = {
  createStoreValidation,
  updateValidation,
};
