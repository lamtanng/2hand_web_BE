import { Response } from 'express';

export const logoutService = async (res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return { message: 'Logged out successfully' };
};
