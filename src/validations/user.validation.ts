import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { ObjectIDRegex, PasswordRegex } from '../constants/validation';
import { SendSmsOtpRequestProps, VerifySmsOtpRequestProps } from '../types/http/otp.type';
import { UserProps } from '../types/model/user.type';
import { catchErrors } from '../utils/catchErrors';
import { addressValidation } from './address.validation';
import { CommonValidation } from './common.validation';
import { UpdateUserInfoRequestProps } from '../types/http/user.type';

interface UserSchema extends UserProps {}
interface UpdateUserSchema extends UpdateUserInfoRequestProps {}
interface SendSmsOtpSchema extends SendSmsOtpRequestProps {}
interface VerifySmsOtpSchema extends VerifySmsOtpRequestProps {}
interface PhoneNumberSchema extends Pick<UserProps, 'phoneNumber'> {}

const { addressSchema } = addressValidation;
const { idSchema } = CommonValidation;

const phoneNumberSchema = Joi.object<PhoneNumberSchema>({
  phoneNumber: Joi.string()
    .required()
    .custom((value: string, helpers) => {
      if (!value.startsWith('+84')) {
        return helpers.message({ custom: 'Phone number must start with +84' });
      }

      if (!isValidPhoneNumber(value, 'VI')) {
        return helpers.error('any.invalid');
      }
      return true;
    }),
});

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

const sendSmsOtpSchema = phoneNumberSchema.append<SendSmsOtpSchema>({});

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

export const userValidation = {
  sendSmsOtpValidation,
  userModelValidation,
  verifySmsOtpValidation,
  updateUserValidation,
};
