import Joi from 'joi';
import { RoleProps } from '../types/model/role.type';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';

interface RoleSchema extends RoleProps {}

const roleSchema = Joi.object<RoleSchema>({
  name: Joi.string().required().trim(),
  permission: Joi.array().items(Joi.string()).required(),
});

export const roleValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await roleSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
