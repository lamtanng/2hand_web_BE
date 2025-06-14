import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import {
  CreateEmbeddingRequest,
  CreateEmbeddingResponse,
  OpenAIRequestProps,
  OpenAIResponseProps,
} from '../types/http/openai.type';

const baseURL = 'https://api.yescale.io/v1';

export function promptAI(data: OpenAIRequestProps) {
  const url = `/chat/completions`;
  return axiosClient.post<OpenAIResponseProps>(url, data, {
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
  });
}

export const createEmbedding = async (data: CreateEmbeddingRequest) => {
  const url = `/embeddings`;
  const convertedData = {
    ...data,
    model: data.model || 'text-embedding-3-large',
  };

  return await axiosClient
    .post<CreateEmbeddingResponse>(url, convertedData, {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
    })
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};
