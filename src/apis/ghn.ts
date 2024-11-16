import { axiosClient } from '../config/axios';
import { env } from '../config/environment';
import { GetDistrictRequestProps, GetWardRequestProps } from '../types/http/address.type';
import {
  CreateGHNStoreRequestProps,
  CreateGHNStoreResponseProps,
  GetAvailableServiceRequestProps,
  GetAvailableServiceResponseProps,
} from '../types/http/ghn.type';
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
const getServiceUrl = `/v2/shipping-order/available-services`;
const calcShippingFeeUrl = `/v2/shipping-order/fee`;
const getProvinceUrl = `${baseURL}/master-data/province`;
const getDistrictUrl = `${baseURL}/master-data/district`;
const getWardUrl = `${baseURL}/master-data/ward`;
const axiosGHN = axiosClient;
axiosGHN.defaults.baseURL = baseURL;
axiosGHN.defaults.headers.common['Token'] = env.GHN_TOKEN;

export function createGHNStoreAPI(data: CreateGHNStoreRequestProps) {
  return axiosGHN.post<CreateGHNStoreResponseProps>(createStoreUrl, data);
}

export function calcShippingFeeAPI(data: CalcShippingFeeRequestProps) {
  return axiosGHN.post<CalcShippingFeeResponseProps>(calcShippingFeeUrl, data, {
    headers: {
      Token: env.GHN_TOKEN,
    },
  });
}

export function getAvailableServiceAPI(data: GetAvailableServiceRequestProps) {
  return axiosGHN.post<GetAvailableServiceResponseProps>(getServiceUrl, data);
}

export function getProvinceAPI() {
  return axiosGHN.get<ProvincesAddressProps>(getProvinceUrl);
}

export function getDistrictAPI({ province_id }: GetDistrictRequestProps) {
  const data = { province_id: Number(province_id) };
  console.log(data);
  return axiosGHN.get<DistrictAddressProps>(getDistrictUrl, {
    data,
  });
}

export function getWardAPI({ district_id }: GetWardRequestProps) {
  const data = { district_id: Number(district_id) };
  return axiosGHN.get<WardAddressProps>(getWardUrl, {
    data,
  });
}
