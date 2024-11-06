import { axiosClient } from '../config/axios';
import {
  CreateMoMoPaymentRequestProps,
  CreateMoMoPaymentResponseProps,
} from '../types/http/momoPayment.type';
import { MOMO } from '../constants/momo';

const baseURL = MOMO.baseURL;
export function createMoMoPayment(data: CreateMoMoPaymentRequestProps) {
  const url = `/create`;
  return axiosClient.post<CreateMoMoPaymentResponseProps>(url, data, {
    baseURL,
    headers: {
      'Content-Length': Buffer.byteLength(JSON.stringify(data)),
    },
  });
}
