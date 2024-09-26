import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { AccountProps } from '../types/account.type';
import { catchErrors } from '../utils/catchErrors';

const loginSchema = Joi.object<AccountProps>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
});

// post
const login = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  // abortEarly: false will return all errors found in the request bod
  await loginSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const loginValidation = {
  login,
};
