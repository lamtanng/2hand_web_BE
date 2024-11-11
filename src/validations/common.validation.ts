import Joi from "joi";
import { ObjectIDRegex } from "../constants/validation";

const idSchema = Joi.string().regex(ObjectIDRegex, 'valid id');

export const CommonValidation = {
  idSchema,
};
