import { axiosClient } from '../config/axios';
import {
  CreateMoMoPaymentRequestProps,
  CreateMoMoPaymentResponseProps,
} from '../types/http/momoPayment.type';

export function createMoMoPayment(data: CreateMoMoPaymentRequestProps) {
  const url = `/create`;
  return axiosClient.post<CreateMoMoPaymentResponseProps>(url, data, {
    headers: {
      'Content-Length': Buffer.byteLength(JSON.stringify(data)),
    },
  });
}
