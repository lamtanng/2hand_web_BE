import Joi from "joi";
import { catchErrors } from "../utils/catchErrors";
import { NextFunction, Request, Response } from "express";
import { ReasonProps } from "../types/reason.type";
import { ObjectType } from "../types/enum/objectType.enum";
import { TaskType } from "../types/enum/taskType.enum";

interface ReasonSchema extends ReasonProps {}

const reasonSchema = Joi.object<ReasonSchema>({
    name: Joi.string().required().trim(),
    objectType: Joi.string().valid(ObjectType).required(),
    taskType: Joi.string().valid(TaskType).required(),
});

export const reasonValidation = catchErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      // abortEarly: false will return all errors found in the request bod
      await reasonSchema.validateAsync(req.body, { abortEarly: false });
      next();
    },
  );
  