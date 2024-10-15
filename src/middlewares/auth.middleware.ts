import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { RoleModel } from '../models/role';
import { AppError } from '../types/error.type';
import { DecodedTokenProps } from '../types/token.type';
import { catchAuthErrors, catchErrors, handleError } from '../utils/catchErrors';
import { verifyAccessToken } from '../utils/jwt';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    await verifyAccessToken(accessToken);
    next();
  } catch (error: AppError) {
    catchAuthErrors(error, next);
  }
};

export const checkRolePermission = (action: string) => {
  return catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const { roleID } = (await verifyAccessToken(accessToken)) as DecodedTokenProps;

    const permission = await RoleModel.findOne({
      _id: roleID[0]._id,
      permission: action,
    });

    permission
      ? next()
      : handleError({
          message: HttpMessage.ACCESS_DENIED,
          statusCode: StatusCodes.FORBIDDEN,
          next,
        });
  });
};
