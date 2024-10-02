import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { LoginRequestProps } from '../../types/http/login.type';
import { catchErrors } from '../../utils/catchErrors';

interface LoginSchema extends LoginRequestProps {}

const loginSchema = Joi.object<LoginSchema>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
});

export const loginValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
