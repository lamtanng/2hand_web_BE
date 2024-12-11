import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { ObjectType } from '../types/enum/objectType.enum';
import { TaskType } from '../types/enum/taskType.enum';
import { CreateReasonRequest, UpdateReasonRequest } from '../types/http/reason.type';
import { catchErrors } from '../utils/catchErrors';
import { Role } from '../types/enum/role.enum';
import { CommonValidation } from './common.validation';

interface NewReasonSchema extends CreateReasonRequest {}
interface UpdateReasonSchema extends UpdateReasonRequest {}

const { idSchema } = CommonValidation;

const newReasonSchema = Joi.object<NewReasonSchema>({
  name: Joi.string().required().trim(),
  objectType: Joi.string()
    .valid(...Object.values(ObjectType))
    .required(),
  taskType: Joi.string()
    .valid(...Object.values(TaskType))
    .required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
});

const updateReasonSchema = Joi.object<UpdateReasonSchema>({
  _id: idSchema.required(),
  name: Joi.string().required().trim(),
});

export const addReasonValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await newReasonSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const updateReasonValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await updateReasonSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
