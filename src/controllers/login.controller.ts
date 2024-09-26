import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AsyncFuncProps } from '../types/asyncFunc';
import { loginService } from '../services/login.service';
import ApiError from '../utils/ApiError';
import { AppError } from '../types/error.type';
import { catchErrors } from '../utils/catchErrors';

// post
const login = catchErrors(async (req: Request, res: Response) => {
  //navigate to service layer to execute the business logic
  const result = await loginService.login(req.body, res);

  res.status(StatusCodes.OK).json(result).send();
});

export const loginController = {
  login,
};
