import Joi from 'joi';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { ObjectIDRegex } from '../constants/validation';

const idSchema = Joi.string().regex(ObjectIDRegex, 'valid id');
const passwordSchema = Joi.string().min(6).required().trim().strict();
const phoneNumberSchema = Joi.string()
  .required()
  .custom((value: string, helpers) => {
    if (!value.startsWith('+84')) {
      return helpers.message({ custom: 'Phone number must start with +84' });
    }

    if (!isValidPhoneNumber(value, 'VI')) {
      return helpers.error('any.invalid');
    }
    return true;
  });

export const CommonValidation = {
  idSchema,
  passwordSchema,
  phoneNumberSchema,
};
