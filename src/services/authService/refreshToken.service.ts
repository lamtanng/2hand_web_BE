import { Request, Response } from 'express';
import { AppError } from '../../types/error.type';
import { UserProps } from '../../types/model/user.type';
import { catchAuthErrors } from '../../utils/catchErrors';
import { setAccessTokenToCookies, signAccessToken, verifyRefreshToken } from '../../utils/jwt';
import ApiError from '../../utils/classes/ApiError';
import { UserModel } from '../../models/user';
import { HttpMessage } from '../../constants/httpMessage';
import { StatusCodes } from 'http-status-codes';

export const refreshTokenService = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const user = (await verifyRefreshToken(refreshToken)) as UserProps;
    const existUser = await UserModel.findOne({ _id: user._id }).exec();
    if (!existUser) {
      return new ApiError({
        message: HttpMessage.NOT_FOUND.USER,
        statusCode: StatusCodes.NOT_FOUND,
      }).rejectError();
    }
    const accessToken = await signAccessToken(existUser.toJSON());
    if (!accessToken) {
      throw new ApiError({ message: 'Invalid access token', statusCode: 401 });
    }
    setAccessTokenToCookies(res, accessToken);

    return { accessToken, refreshToken };
  } catch (error: AppError) {
    await catchAuthErrors(error);
  }
};
