import Joi from "joi";
import { catchErrors } from "../utils/catchErrors";
import { NextFunction, Request, Response } from "express";
import { StoreProps } from "../types/store.type";
import { ObjectIDRegex } from "../constants/validation";

interface StoreSchema extends StoreProps {}

const storeSchema = Joi.object<StoreSchema>({
    name: Joi.string().required().trim(),
    slug: Joi.string(),
    description: Joi.string().trim(),
    address: [ Joi.string() ],
    avatar: Joi.string(),
    coverImg: Joi.string(),
    isActive: Joi.boolean().default(true),
    userID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const storeValidation = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      // abortEarly: false will return all errors found in the request bod
      await storeSchema.validateAsync(req.body, { abortEarly: false });
      next();
    },
  );
  