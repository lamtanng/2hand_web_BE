import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginService } from '../services/authService/login.service';
import { logoutService } from '../services/authService/logout.service';
import { refreshTokenService } from '../services/authService/refreshToken.service';
import { signupService } from '../services/authService/signup.service';
import { catchErrors } from '../utils/catchErrors';

const login = catchErrors(async (req: Request, res: Response) => {
  const result = await loginService.login(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

const signup = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await signupService(req.body);
  res.status(StatusCodes.OK).json(newUser);
  next();
});

const logout = catchErrors(async (req: Request, res: Response) => {
  const logout = await logoutService(res);
  res.status(StatusCodes.OK).json(logout).send();
});

const refreshToken = catchErrors(async (req: Request, res: Response) => {
  const refreshToken = await refreshTokenService(req, res);
  res.status(StatusCodes.OK).json(refreshToken).send();
});

export const authController = {
  login,
  signup,
  logout,
  refreshToken,
};
