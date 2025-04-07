import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { promptAI } from '../apis/openai';
import { OpenAIResponseProps } from '../types/http/openai.type';

const promptAIService = catchServiceFunc(async (req: Request, res: Response) => {
  const response = await promptAI(req.body) as unknown as OpenAIResponseProps;
  return response.choices;
});

export const openaiService = { promptAIService };
