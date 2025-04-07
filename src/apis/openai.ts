import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import { OpenAIRequestProps, OpenAIResponseProps } from '../types/http/openai.type';

const baseURL = 'https://api.yescale.io';

export function promptAI(data: OpenAIRequestProps) {
  const url = `/v1/chat/completions`;
  return axiosClient.post<OpenAIResponseProps>(url, data, {
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
  });
}
