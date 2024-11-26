import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { ReviewProps } from '../types/model/review.type';
import { ObjectIDRegex } from '../constants/validation';
import { CreateReviewRequest } from '../types/http/review.type';
import { CommonValidation } from './common.validation';

interface CreateReviewSchema extends CreateReviewRequest {}

const { idSchema } = CommonValidation;

const createReviewSchema = Joi.object<CreateReviewSchema>().keys({
  content: Joi.string().default(null),
  rate: Joi.number().min(1).max(5),
  image: Joi.array().items(Joi.string()).allow(null),
  video: Joi.array().items(Joi.string()).allow(null),
  reviewerID: idSchema.required(),
  productID: idSchema.required(),
  orderID: idSchema.required(),
});

export const createValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await createReviewSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const reviewValidation = { createValidation };
