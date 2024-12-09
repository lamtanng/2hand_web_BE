import Joi from 'joi';
import { ObjectIDRegex } from '../constants/validation';

const idSchema = Joi.string().regex(ObjectIDRegex, 'valid id');
const passwordSchema = Joi.string().min(6).required().trim().strict();

export const CommonValidation = {
  idSchema,
  passwordSchema,
};
