import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { promptAI } from '../apis/openai';
import { OpenAIRequestProps, OpenAIResponseProps, PromptType } from '../types/http/openai.type';
import { PROMPT_MAP } from '../constants/promptAI';

const promptAIService = catchServiceFunc(async (req: Request, res: Response) => {
  const content = req.body?.content;
  const promptType = req.body?.promptType as PromptType;

  const payload: OpenAIRequestProps = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: PROMPT_MAP[promptType],
      },
      {
        role: 'user',
        content: content,
      },
    ],
    stream: false,
    temperature: 1,
    n: 1,
    toolChoice: { type: 'none' },
    tools: [],
  };

  const response = (await promptAI(payload)) as unknown as OpenAIResponseProps;
  return response.choices.map((choice) => choice.message?.content);
});

export const openaiService = { promptAIService };
