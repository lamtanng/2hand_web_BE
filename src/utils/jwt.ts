import { Response } from 'express';
import ms from 'ms';
import { env } from '../config/environment';
import { cookieOptions } from '../constants/cookieOptions';
import { JwtProvider } from '../providers/JwtProvider';
import { UserProps } from '../types/model/user.type';

export const getSecretKeyFromEnv = (secretKey: string) => secretKey.replace(/\\n/g, '\n');

export const signAccessToken = async (user: UserProps) =>
  await JwtProvider.generateToken({
    user,
    secretKey: getSecretKeyFromEnv(env.ACCESS_TOKEN_SECRET_KEY),
    expiresIn: env.ACCESS_TOKEN_EXPIRED,
  });
export const signRefreshToken = async (user: UserProps) =>
  await JwtProvider.generateToken({
    user,
    secretKey: getSecretKeyFromEnv(env.REFRESH_TOKEN_SECRET_KEY),
    expiresIn: env.REFRESH_TOKEN_EXPIRED,
  });

export const verifyAccessToken = async (accessToken: string) =>
  await JwtProvider.verifyToken(accessToken, getSecretKeyFromEnv(env.ACCESS_TOKEN_SECRET_KEY));

export const verifyRefreshToken = async (refreshToken: string) =>
  await JwtProvider.verifyToken(refreshToken, getSecretKeyFromEnv(env.REFRESH_TOKEN_SECRET_KEY));

export const setAccessTokenToCookies = (res: Response, accessToken: string) =>
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: ms(env.ACCESS_TOKEN_EXPIRED),
  });

export const setRefreshTokenToCookies = (res: Response, refreshToken: string) =>
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: ms(env.REFRESH_TOKEN_EXPIRED),
  });
