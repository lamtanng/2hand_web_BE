import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectType } from '../types/enum/objectType.enum';
import { TaskType } from '../types/enum/taskType.enum';
import { CreateReasonRequest } from '../types/http/reason.type';
import { catchErrors } from '../utils/catchErrors';

interface ReasonSchema extends CreateReasonRequest {}

const reasonSchema = Joi.object<ReasonSchema>({
  name: Joi.string().required().trim(),
  objectType: Joi.string()
    .valid(...Object.values(ObjectType))
    .required(),
  taskType: Joi.string()
    .valid(...Object.values(TaskType))
    .required(),
});

export const reasonValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await reasonSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
