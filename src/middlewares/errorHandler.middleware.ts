/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { env } from '../config/environment';
import ApiError from '../utils/classes/ApiError';

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const responseError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    stack: env.BUILD_MODE === 'dev' ? err.stack : {},
  };

  // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
  res.status(responseError.statusCode).json(responseError);
  return;
};
