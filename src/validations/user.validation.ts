import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectIDRegex, PasswordRegex } from '../constants/validation';
import {
  SendSmsOtpRequestProps,
  VerifyOtpRequestProps,
  VerifySmsOtpRequestProps,
} from '../types/http/otp.type';
import { ResetPasswordRequestProps, UpdateUserInfoRequestProps } from '../types/http/user.type';
import { UserProps } from '../types/model/user.type';
import { catchErrors } from '../utils/catchErrors';
import { addressValidation } from './address.validation';
import { CommonValidation } from './common.validation';

interface UserSchema extends UserProps {}
interface UpdateUserSchema extends UpdateUserInfoRequestProps {}
interface SendSmsOtpSchema extends SendSmsOtpRequestProps {}
interface VerifySmsOtpSchema extends VerifySmsOtpRequestProps {}
interface ResetPasswordSchema extends ResetPasswordRequestProps {}
interface VerifySignupSchema extends VerifyOtpRequestProps {}

const { addressSchema } = addressValidation;
const { idSchema, passwordSchema, phoneNumberSchema } = CommonValidation;

const userSchema = Joi.object<UserSchema>({
  firstName: Joi.string().default(null).trim(),
  lastName: Joi.string().default(null).trim(),
  password: Joi.string().pattern(new RegExp(PasswordRegex)).allow(null, ''),
  dateOfBirth: Joi.date().iso(),
  address: Joi.array().items(addressSchema).allow(null, ''),
  isActive: Joi.boolean().default(true),
  isVerified: Joi.boolean().default(false),
  roleID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followerID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  followingID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  blockedID: [Joi.string().regex(ObjectIDRegex, 'valid id')],
  avatar: Joi.string().default(null).trim().allow(null, ''),
});

const sendSmsOtpSchema = Joi.object<SendSmsOtpSchema>({
  phoneNumber: phoneNumberSchema,
});

const verifySmsOtpSchema = sendSmsOtpSchema.append<VerifySmsOtpSchema>({
  _id: idSchema.required(),
  otp: Joi.string().length(6).required(),
});

const updateUserSchema = Joi.object<UpdateUserSchema>({
  _id: idSchema.required(),
  firstName: Joi.string().trim().allow(null, ''),
  lastName: Joi.string().trim().allow(null, ''),
  dateOfBirth: Joi.date().iso().allow(null, ''),
  avatar: Joi.string().trim().allow(null, ''),
});

const resetPasswordSchema = Joi.object<ResetPasswordSchema>().keys({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema.valid(Joi.ref('password')),
});

const verifySignupSchema = Joi.object<VerifySignupSchema>().keys({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
  otp: Joi.string().length(6).required(),
});

const userModelValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await userSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const updateUserValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await updateUserSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const sendSmsOtpValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await sendSmsOtpSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const verifySmsOtpValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await verifySmsOtpSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const resetPasswordValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await resetPasswordSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

const verifySignupValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await verifySignupSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const userValidation = {
  sendSmsOtpValidation,
  userModelValidation,
  verifySmsOtpValidation,
  updateUserValidation,
  resetPasswordValidation,
  verifySignupValidation,
};
