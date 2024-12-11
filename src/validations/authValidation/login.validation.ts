import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { LoginRequestProps } from '../../types/http/login.type';
import { catchErrors } from '../../utils/catchErrors';
import { CommonValidation } from '../common.validation';

interface LoginSchema extends LoginRequestProps {}

const { phoneNumberSchema, passwordSchema } = CommonValidation;

const loginSchema = Joi.object<LoginSchema>({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
});

export const loginValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
