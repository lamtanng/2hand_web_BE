import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { CreateReviewRequest, ReactToReviewRequest } from '../types/http/review.type';
import { catchErrors } from '../utils/catchErrors';
import { CommonValidation } from './common.validation';

interface CreateReviewSchema extends CreateReviewRequest {}
interface ReactToReviewSchema extends ReactToReviewRequest {}

const { idSchema } = CommonValidation;

const createReviewSchema = Joi.object<CreateReviewSchema>().keys({
  content: Joi.string().default(null),
  rate: Joi.number().min(1).max(5),
  image: Joi.array().items(Joi.string()).allow(null),
  video: Joi.array().items(Joi.string()).allow(null),
  productID: idSchema.required(),
  reviewerID: idSchema.required(),
  orderDetailID: idSchema.required(),
});

const reactToReviewSchema = Joi.object<ReactToReviewSchema>().keys({
  _id: idSchema.required(),
  likes: Joi.number().allow(null),
  replyMessage: Joi.string().allow(null),
});

const createValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await createReviewSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const reactToReviewValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await reactToReviewSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const reviewValidation = { createValidation, reactToReviewValidation };
