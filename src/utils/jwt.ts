import { env } from '../config/environment';
import { JwtProvider } from '../providers/JwtProvider';
import { AccountProps } from '../types/account.type';

export const getSecretKeyFromEnv = (secretKey: string) => secretKey.replace(/\\n/g, '\n');

export const signAccessToken = async (account: AccountProps) =>
  await JwtProvider.generateToken({
    account,
    secretKey: getSecretKeyFromEnv(env.ACCESS_TOKEN_SECRET_KEY),
    expiresIn: env.ACCESS_TOKEN_EXPIRED,
  });
export const signRefreshToken = async (account: AccountProps) =>
  await JwtProvider.generateToken({
    account,
    secretKey: getSecretKeyFromEnv(env.REFRESH_TOKEN_SECRET_KEY),
    expiresIn: env.REFRESH_TOKEN_EXPIRED,
  });

export const verifyAccessToken = async (token: string) =>
  await JwtProvider.verifyToken(token, getSecretKeyFromEnv(env.ACCESS_TOKEN_SECRET_KEY));

export const verifyRefreshToken = async (token: string) =>
  await JwtProvider.verifyToken(token, getSecretKeyFromEnv(env.REFRESH_TOKEN_SECRET_KEY));
