import { Request, Response } from 'express';
import { AccountModel } from '../../models/account';
import { AccountProps, SignUpProps } from '../../types/account.type';
import { Role } from '../../types/enum/role.enum';
import { catchErrors } from '../../utils/catchErrors';

export const refreshTokenService = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  return refreshToken;
};
