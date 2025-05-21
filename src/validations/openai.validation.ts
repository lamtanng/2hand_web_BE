import { NextFunction, Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import Joi from 'joi';
import { PromptAIRequestProps, PromptType } from '../types/http/openai.type';

const promptAISchema = Joi.object<PromptAIRequestProps>({
  content: Joi.any().required(),
  promptType: Joi.string()
    .valid(...Object.values(PromptType))
    .required(),
});

const promptAIValidation = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await promptAISchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const openaiValidation = { promptAIValidation };
