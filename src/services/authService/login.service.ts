import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../../constants/httpMessage';
import { AccountModel } from '../../models/account';
import { AccountProps } from '../../types/account.type';
import ApiError from '../../utils/classes/ApiError';
import {
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  signAccessToken,
  signRefreshToken,
} from '../../utils/jwt';
import { LoginResponseProps } from '../../types/http/login.type';

const login = async (reqBody: AccountProps, res: Response) => {
  const account = reqBody;

  //check if the user exists
  const existAccount = await AccountModel.findOne({ email: account.email }).exec();
  if (!existAccount) {
    return new ApiError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }

  //if the user exists, check if the password is correct
  const isMatchPassword = await existAccount.comparePassword(account.password);
  if (!isMatchPassword) {
    return new ApiError({
      message: HttpMessage.INCORRECT.PASSWORD,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }

  //generate a token
  const accessToken = await signAccessToken(existAccount.toJSON());
  const refreshToken = await signRefreshToken(existAccount.toJSON());

  // assign to cookies
  setAccessTokenToCookies(res, accessToken);
  setRefreshTokenToCookies(res, refreshToken);

  const response: LoginResponseProps = {
    accessToken,
    refreshToken,
    id: String(existAccount._id),
    email: existAccount.email,
    role: existAccount.role,
  };
  return response;
};

export const loginService = { login };
