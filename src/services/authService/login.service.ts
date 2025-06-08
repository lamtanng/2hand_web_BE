import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpMessage } from '../../constants/httpMessage';
import { StoreModel } from '../../models/store';
import { UserModel } from '../../models/user';
import { LoginRequestProps, LoginResponseProps } from '../../types/http/login.type';
import { catchServiceFunc } from '../../utils/catchErrors';
import ApiError from '../../utils/classes/ApiError';
import {
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  signAccessToken,
  signRefreshToken,
} from '../../utils/jwt';
import { formatPhoneNumber } from '../../utils/phone';

const login = catchServiceFunc(async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body as LoginRequestProps;
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  //check if the user exists
  const existUser = await UserModel.findOne({ phoneNumber: formattedPhoneNumber })
    .populate('roleID', 'id name')
    .exec();
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

  const store = await StoreModel.findOne({
    userID: existUser._id,
  });

  const tokenData = {
    ...existUser.toJSON(),
    storeId: store?._id.toString() || undefined,
  };

  //generate a token
  const accessToken = await signAccessToken(tokenData);
  const refreshToken = await signRefreshToken(tokenData);

  // assign to cookies
  setAccessTokenToCookies(res, accessToken);
  setRefreshTokenToCookies(res, refreshToken);

  const response: LoginResponseProps = {
    accessToken,
    refreshToken,
  };
  return response;
});

export const loginService = { login };
