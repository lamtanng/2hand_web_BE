import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { HttpMessage } from '../../constants/httpMessage';
import { UserModel } from '../../models/user';
import { SignUpRequestProps } from '../../types/http/signup.type';
import { catchErrors, handleError } from '../../utils/catchErrors';

interface SignupSchema extends SignUpRequestProps {}

const registerSchema = Joi.object<SignupSchema>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
  confirmPassword: Joi.string().min(6).required().trim().strict().valid(Joi.ref('password')),
});

export const signupValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await registerSchema.validateAsync(req.body, { abortEarly: false });

    //check if the user exists
    const existUser = await UserModel.findOne({ email: req.body?.email }).exec();
    existUser &&
      handleError({
        message: HttpMessage.CONFLICT.USER,
        statusCode: StatusCodes.CONFLICT,
        next,
      });

    next();
  },
);
