import Joi from "joi";
import { catchErrors } from "../utils/catchErrors";
import { NextFunction, Request, Response } from "express";
import { ReviewProps } from "../types/reivew.type";
import { ObjectIDRegex } from "../constants/validation";

interface ReviewSchema extends ReviewProps {}

const reviewSchema = Joi.object<ReviewSchema>({
    content: Joi.string().default(null),
    rate: Joi.number().min(1).max(5).required(),
    image: [ Joi.string() ],
    video: [ Joi.string() ],
    isActive: Joi.boolean().default(true),
    replyMessage: Joi.string().default(null),
    reviewerID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
    productID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const reivewValidation = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      // abortEarly: false will return all errors found in the request bod
      await reviewSchema.validateAsync(req.body, { abortEarly: false });
      next();
    },
  );
  