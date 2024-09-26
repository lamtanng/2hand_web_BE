import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { SignUpProps } from '../types/account.type';

const registerSchema = Joi.object<SignUpProps>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
  confirmPassword: Joi.string().min(6).required().trim().strict().valid(Joi.ref('password')),
});

const signup = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await registerSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const signupValidation = { signup };
