import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { SignUpRequestProps } from '../../types/http/signup.type';
import { catchErrors } from '../../utils/catchErrors';
import { CommonValidation } from '../common.validation';

interface SignupSchema extends SignUpRequestProps {}

const { passwordSchema, phoneNumberSchema } = CommonValidation;

const registerSchema = Joi.object<SignupSchema>({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema.valid(Joi.ref('password')),
});

export const signupValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await registerSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
