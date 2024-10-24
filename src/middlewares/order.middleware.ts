import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { UserProps } from '../types/model/user.type';
import { Role } from '../types/enum/role.enum';
import { JwtPayload } from 'jsonwebtoken';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const isCheckout = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const {   resultCode, message } = req.body;
  if (resultCode == 4001) {
    next();
    return;
  }

  throw new ApiError({
    message,
    statusCode: resultCode,
  });
});

const checkRole = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { roleID } = (await verifyAccessToken(req.cookies.accessToken)) as JwtPayload;
  const roleName = roleID[0]?.name;

  if (roleName == Role.Admin) {
    next();
    return;
  }

  if (!req.query.userID) {
    throw new ApiError({
      message: ReasonPhrases.BAD_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  next();
});

export const orderMiddleware = { checkRole, isCheckout };
