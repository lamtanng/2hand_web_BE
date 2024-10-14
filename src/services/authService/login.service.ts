import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../../constants/httpMessage';
import { UserModel } from '../../models/user';
import { LoginResponseProps } from '../../types/http/login.type';
import { UserProps } from '../../types/model/user.type';
import ApiError from '../../utils/classes/ApiError';
import {
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  signAccessToken,
  signRefreshToken,
} from '../../utils/jwt';

const login = async (reqBody: UserProps, res: Response) => {
  const { email, password } = reqBody;

  //check if the user exists
  const existUser = await UserModel.findOne({ email }).populate('roleID', 'id name').exec();
  if (!existUser) {
    return new ApiError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }

  //if the user exists, check if the password is correct
  const isMatchPassword = await existUser.comparePassword(password);
  if (!isMatchPassword) {
    return new ApiError({
      message: HttpMessage.INCORRECT.PASSWORD,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }

  //generate a token
  const accessToken = await signAccessToken(existUser.toJSON());
  const refreshToken = await signRefreshToken(existUser.toJSON());

  // assign to cookies
  setAccessTokenToCookies(res, accessToken);
  setRefreshTokenToCookies(res, refreshToken);

  const response: LoginResponseProps = {
    accessToken,
    refreshToken,
  };
  return response;
};

export const loginService = { login };
