import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { UserProps } from '../types/model/user.type';
import { ObjectIDRegex, PasswordRegex } from '../constants/validation';

interface UserSchema extends UserProps {}

const userSchema = Joi.object<UserSchema>({
  firstName: Joi.string().default(null).trim(),
  lastName: Joi.string().default(null).trim(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(PasswordRegex)).required(),
  phoneNumber: Joi.string().length(10).default(null).trim(),
  dateOfBirth: Joi.date().iso(),
  address: [Joi.string()],
  isActive: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  roleID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followerID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followingID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  blockedID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
});

export const userValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await userSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
