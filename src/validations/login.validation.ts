import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '../utils/ApiError';
import { AccountProps } from '../types/account.type';
import { AppError } from '../types/error.type';

const loginSchema = Joi.object<AccountProps>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
});

// post
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // abortEarly: false will return all errors found in the request body
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    //redirect to controller
    next();
  } catch (err: AppError) {
    const customError = new ApiError({ message: new Error(err).message, statusCode: StatusCodes.UNPROCESSABLE_ENTITY });
    next(customError);
  }
};

export const loginValidation = {
  login,
};
