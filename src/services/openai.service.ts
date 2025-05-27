import { Request, response, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { promptAI } from '../apis/openai';
import { OpenAIRequestProps, OpenAIResponseProps, PromptType } from '../types/http/openai.type';
import { PROMPT_MAP } from '../constants/promptAI';
import ApiError from '../utils/classes/ApiError';

const promptAIService = catchServiceFunc(async (req: Request, res: Response) => {
  const content = req.body?.content;
  const promptType = req.body?.promptType as PromptType;

  const result = await askWithAI(content, promptType);
  return result;
});

const askWithAI = async (content: any, promptType: PromptType) => {
  try {
    const payload: OpenAIRequestProps = {
      model: 'o4-mini-2025-04-16',
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
    console.log('choices', response.choices);
    return response.choices.map((choice) => choice.message?.content);
  } catch (error) {
    console.log('error', error);
  }
};

export const openaiService = { promptAIService, askWithAI };
