import { NextFunction, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ms from 'ms';
import { env } from '../../config/environment';
import { cookieOptions } from '../../constants/cookieOptions';
import { AccountModel } from '../../models/account';
import { AccountProps } from '../../types/account.type';
import { handleError } from '../../utils/catchErrors';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { HttpMessage } from '../../constants/httpMessage';

const login = async (reqBody: AccountProps, res: Response, next: NextFunction) => {
  const account = reqBody;

  //check if the user exists
  const existAccount = await AccountModel.findOne({ email: account.email }).exec();
  if (!existAccount) {
    //Should define global function to throw not_found error
    handleError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
      next,
    });
    return;
  }

  //if the user exists, check if the password is correct

  //generate a token
  const accessToken = await signAccessToken(account);
  const refreshToken = await signRefreshToken(account);

  // assign to cookies
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: ms('15m'),
  });
  res.cookie('refreshToken', accessToken, {
    ...cookieOptions,
    maxAge: ms(env.REFRESH_TOKEN_EXPIRED),
  });

  return {
    accessToken,
    refreshToken,
    id: existAccount._id,
    email: existAccount.email,
    Role: existAccount.role,
  };
};

export const loginService = { login };
