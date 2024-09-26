import { Response } from 'express';
import { env } from '../config/environment';
import { JwtProvider } from '../providers/JwtProvider';
import { AccountProps } from '../types/account.type';
import { AppError } from '../types/error.type';
import ms from 'ms';
import { getSecretKeyFromEnv } from '../utils/jwt';

const login = async (reqBody: AccountProps, res: Response) => {
  const account = reqBody;
  //check if the user exists
  //if the user exists, check if the password is correct

  //generate a token
  const accessToken = await JwtProvider.generateToken({
    account,
    secretKey: getSecretKeyFromEnv(env.ACCESS_TOKEN_SECRET_KEY),
    expiresIn: env.ACCESS_TOKEN_EXPIRED,
  });
  const refreshToken = await JwtProvider.generateToken({
    account,
    secretKey: getSecretKeyFromEnv(env.REFRESH_TOKEN_SECRET_KEY),
    expiresIn: env.REFRESH_TOKEN_EXPIRED,
  });

  // assign to cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms(env.ACCESS_TOKEN_EXPIRED),
  });
  res.cookie('refreshToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms(env.REFRESH_TOKEN_EXPIRED),
  });

  return { accessToken, refreshToken, ...account };
};

export const loginService = { login };
