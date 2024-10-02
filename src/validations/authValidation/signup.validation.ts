import Joi from 'joi';
import { catchErrors } from '../../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { SignUpRequestProps } from '../../types/http/signup.type';

interface SignupSchema extends SignUpRequestProps {}

const registerSchema = Joi.object<SignupSchema>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
  confirmPassword: Joi.string().min(6).required().trim().strict().valid(Joi.ref('password')),
});

export const signupValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await registerSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

