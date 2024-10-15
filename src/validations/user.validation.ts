import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { AddressProps, UserProps } from '../types/model/user.type';
import { ObjectIDRegex, PasswordRegex, VNCharRegex } from '../constants/validation';

interface UserSchema extends UserProps {}

const addressSchema = Joi.object<AddressProps>({
  address: Joi.string(),
  districtCode: Joi.number().min(0).required(),
  cityCode: Joi.number().min(0).required(),
  provincesCode: Joi.number().min(0).required(),
  isDefault: Joi.boolean().default(false),
});

const userSchema = Joi.object<UserSchema>({
  firstName: Joi.string().default(null).trim(),
  lastName: Joi.string().default(null).trim(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(PasswordRegex)).required(),
  phoneNumber: Joi.string().length(10).default(null).trim(),
  dateOfBirth: Joi.date().iso(),
  address: Joi.array().items(addressSchema),
  isActive: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  roleID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followerID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followingID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  blockedID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
});

export const userValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const userAddressValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await addressSchema.validateAsync({ ...req.body }, { abortEarly: true });
    next();
  },
);
