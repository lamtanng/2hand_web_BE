import { Request, Response } from 'express';
import { AccountProps } from '../../types/account.type';
import { AppError } from '../../types/error.type';
import { catchAuthErrors } from '../../utils/catchErrors';
import { setAccessTokenToCookies, signAccessToken, verifyRefreshToken } from '../../utils/jwt';

export const refreshTokenService = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    const { email, role, password } = (await verifyRefreshToken(refreshToken)) as AccountProps;
    const account: AccountProps = { email, role, password };
    const accessToken = await signAccessToken(account);
    setAccessTokenToCookies(res, accessToken);

    //xử lý khi refreshToken hết hạn

    return { accessToken, refreshToken };
  } catch (error: AppError) {
    await catchAuthErrors(error);
  }
};
