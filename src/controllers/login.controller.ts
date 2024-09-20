import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AsyncFuncProps } from '../types/asyncFunc';
import { loginService } from '../services/login.service';
import ApiError from '../utils/ApiError';
import { AppError } from '../types/error.type';

// post
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //navigate to service layer to execute the business logic
    const login = await loginService.login(req.body);

    //return the response to the client
    res.status(StatusCodes.OK).json(login).send();
  } catch (error: AppError) {
    //handle errors from both the service layer and its layer
    const customError = new ApiError({
      message: new Error(error).message,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
    });
    next(customError);
  }
};

export const loginController = {
  login,
};
