import Joi from "joi";
import { catchErrors } from "../utils/catchErrors";
import { NextFunction, Request, Response } from "express";
import { CategoryProps } from "../types/category.type";
import { ObjectIDRegex } from "../constants/validation";

interface CategorySchema extends CategoryProps {}

const categorySchema = Joi.object<CategorySchema>({
    name: Joi.string().required().trim(),
    isActive: Joi.boolean().default(true),
    parentID: Joi.string().regex(ObjectIDRegex, 'valid id'),
});

export const categoryValidation = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      // abortEarly: false will return all errors found in the request bod
      await categorySchema.validateAsync(req.body, { abortEarly: false });
      next();
    },
  );
  