import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../constants/httpMessage';
import { RoleModel } from '../models/role';
import { AppError } from '../types/error.type';
import { DecodedTokenProps } from '../types/token.type';
import { catchAuthErrors, catchErrors, handleError } from '../utils/catchErrors';
import { verifyAccessToken } from '../utils/jwt';
import { Role } from '../types/enum/role.enum';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies;
    await verifyAccessToken(accessToken);
    next();
  } catch (error: AppError) {
    catchAuthErrors(error, next);
  }
};

const checkRolePermission = (action: string, roleName: Role) => {
  return catchErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const { roleID } = (await verifyAccessToken(accessToken)) as DecodedTokenProps;

    //find role id
    const role = roleID.find((role) => role.name === roleName);
    if (!role) {
      handleError({
        message: HttpMessage.ACCESS_DENIED,
        statusCode: StatusCodes.FORBIDDEN,
        next,
      });
      return;
    }

    //check permission
    const permission = await RoleModel.findOne({
      _id: role._id,
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

export const checkCustomerPermission = (action: string) =>
  checkRolePermission(action, Role.Customer);
export const checkSellerPermission = (action: string) => checkRolePermission(action, Role.Seller);
export const checkAdminPermission = (action: string) => checkRolePermission(action, Role.Admin);
