import { Request, Response } from 'express';
import { AppError } from '../../types/error.type';
import { UserProps } from '../../types/user.type';
import { catchAuthErrors } from '../../utils/catchErrors';
import { setAccessTokenToCookies, signAccessToken, verifyRefreshToken } from '../../utils/jwt';

export const refreshTokenService = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const user = (await verifyRefreshToken(refreshToken)) as UserProps;
    const accessToken = await signAccessToken(user);
    setAccessTokenToCookies(res, accessToken);

    return { accessToken, refreshToken };
  } catch (error: AppError) {
    await catchAuthErrors(error);
  }
};
