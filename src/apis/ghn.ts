import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import { CreateGHNStoreRequestProps, CreateGHNStoreResponseProps } from '../types/http/ghn.type';
import {
  CalcShippingFeeRequestProps,
  CalcShippingFeeResponseProps,
} from '../types/http/order.type';

const baseURL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/v2';
const createStoreUrl = `/shop/register`;
const calcShippingFeeUrl = `/shipping-order/fee`;

const axiosGHN = axiosClient;
axiosGHN.defaults.baseURL = baseURL;

export function createGHNStoreAPI(data: CreateGHNStoreRequestProps) {
  return axiosGHN.post<CreateGHNStoreResponseProps>(createStoreUrl, data, {
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}

export function calcShippingFeeAPI(data: CalcShippingFeeRequestProps) {
  return axiosGHN.post<CalcShippingFeeResponseProps>(calcShippingFeeUrl, data, {
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}
