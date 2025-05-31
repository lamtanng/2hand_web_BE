import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import Joi from 'joi';
import {
  CheckViolationRequestProps,
  PromptAIRequestProps,
  PromptType,
} from '../types/http/openai.type';

const promptAISchema = Joi.object<PromptAIRequestProps>({
  content: Joi.any().required(),
  promptType: Joi.string()
    .valid(...Object.values(PromptType))
    .required(),
});

const checkViolationSchema = Joi.object<CheckViolationRequestProps>({
  content: Joi.array().optional(),
  images: Joi.array().optional(),
});

const promptAIValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await promptAISchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const checkViolationValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    await checkViolationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);

export const openaiValidation = { promptAIValidation, checkViolationValidation };
