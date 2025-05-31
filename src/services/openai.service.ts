import { Request, Response } from 'express';
import { promptAI } from '../apis/openai';
import { PROMPT_MAP } from '../constants/promptAI';
import {
  OpenAIRequestProps,
  OpenAIResponseProps,
  PromptAIResponseProps,
  PromptType,
} from '../types/http/openai.type';
import { catchServiceFunc } from '../utils/catchErrors';

const promptAIService = catchServiceFunc(async (req: Request, res: Response) => {
  const content = req.body?.content;
  const promptType = req.body?.promptType as PromptType;

  const result = await askWithAI(content, promptType);
  return result;
});

const askWithAI = async (content: any, promptType: PromptType) => {
  try {
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
      temperature: 0.7,
      n: 1,
      toolChoice: { type: 'none' },
      tools: [],
    };
    const response = (await promptAI(payload)) as unknown as OpenAIResponseProps;
    return response.choices.map((choice) => choice.message?.content);
  } catch (error) {
    console.log('error', error);
  }
};

const checkCommunityViolation = async (
  content: string[] | undefined,
  images: string[] | undefined,
): Promise<PromptAIResponseProps> => {
  let request: any[] = [];

  if (images?.length) {
    images.forEach((img) => {
      if (img)
        request.push({
          type: 'image_url',
          image_url: { url: img },
        });
    });
  }

  if (content?.length) {
    content.forEach((text) => {
      request.push({
        type: 'text',
        text: text,
      });
    });
  }

  if (request.length === 0) return { status: true, images: [], text: [] };

  const result = await openaiService.askWithAI(request, PromptType.CheckCommunityViolation);
  const data = JSON.parse(result?.[0] || '{}') as PromptAIResponseProps;
  console.log('request', request);
  const response: PromptAIResponseProps = {
    status: true,
    images: data?.images || [],
    text: data?.text || [],
  };

  if (response.images?.length || response.text?.length) response.status = false;

  return response;
};

export const openaiService = { promptAIService, askWithAI, checkCommunityViolation };
