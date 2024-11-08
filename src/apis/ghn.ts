import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import { GetDistrictRequestProps, GetWardRequestProps } from '../types/http/address.type';
import { CreateGHNStoreRequestProps, CreateGHNStoreResponseProps } from '../types/http/ghn.type';
import {
  CalcShippingFeeRequestProps,
  CalcShippingFeeResponseProps,
} from '../types/http/order.type';
import {
  DistrictAddressProps,
  ProvincesAddressProps,
  WardAddressProps,
} from '../types/model/address.type';

const baseURL = 'https://dev-online-gateway.ghn.vn/shiip/public-api';
const createStoreUrl = `/v2/shop/register`;
const calcShippingFeeUrl = `/v2/shipping-order/fee`;
const getProvinceUrl = `${baseURL}/master-data/province`;
const getDistrictUrl = `${baseURL}/master-data/district`;
const getWardUrl = `${baseURL}/master-data/ward`;
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

export function getProvinceAPI() {
  return axiosGHN.get<ProvincesAddressProps>(getProvinceUrl, {
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}

export function getDistrictAPI({ province_id }: GetDistrictRequestProps) {
  const data = { province_id };
  return axiosGHN.get<DistrictAddressProps>(getDistrictUrl, {
    data,
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}

export function getWardAPI({ district_id }: GetWardRequestProps) {
  const data = { district_id };
  return axiosGHN.get<WardAddressProps>(getWardUrl, {
    data,
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}
