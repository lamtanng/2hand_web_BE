import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex, PasswordRegex } from '../constants/validation';
import { UserProps } from '../types/model/user.type';
import { catchErrors } from '../utils/catchErrors';
import { addressValidation } from './address.validation';

interface UserSchema extends UserProps {}

const { addressSchema } = addressValidation;

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
