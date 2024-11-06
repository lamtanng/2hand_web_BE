import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import { CreateGHNStoreRequestProps, CreateGHNStoreResponseProps } from '../types/http/ghn.type';

const baseURL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
const createStoreUrl = `/shop/register`;

const axiosGHN = axiosClient;
axiosGHN.defaults.baseURL = baseURL;

export function createGHNStoreAPI(data: CreateGHNStoreRequestProps) {
  return axiosGHN.post<CreateGHNStoreResponseProps>(createStoreUrl, data, {
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}
