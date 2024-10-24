import { MOMO } from '../constants/momo';
import {
  CreateMoMoPaymentRequestProps,
  MoMoPaymentItemsProps,
} from '../types/http/momoPayment.type';
const crypto = require('crypto');

const {
  accessKey,
  secretKey,
  orderInfo,
  partnerCode,
  ipnUrl,
  requestType,
  algorithm,
  redirectUrl,
  digest,
  autoCapture,
} = MOMO;

interface MoMoCreationSignatureProps {
  amount: number;
  orderId: string;
  requestId?: string;
  extraData?: string;
  items?: MoMoPaymentItemsProps[];
}

export const generateHashSignature = (data: string) =>
  crypto.createHmac(algorithm, secretKey).update(data).digest(digest);

export const getMoMoCreationRequestBody = (data: Partial<CreateMoMoPaymentRequestProps>) => {
  const orderId = partnerCode + new Date().getTime();
  const signature = signMoMoCreationSignature({
    amount: data.amount || 0,
    orderId,
    requestId: orderId,
    extraData: data.extraData || '',
    items: data.items || [],
  });

  const reqBodyDefault = {
    partnerCode,
    // storeId: 'MomoTestStore',
    amount: 0,
    orderId: orderId,
    requestId: orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: 'vi',
    requestType,
    autoCapture,
    extraData: '',
    signature,
    items: '',
  };
  return { ...reqBodyDefault, ...data } as CreateMoMoPaymentRequestProps;
};

const signMoMoCreationSignature = ({
  amount,
  orderId,
  requestId = orderId,
  extraData = '',
}: MoMoCreationSignatureProps) => {
  const rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;
  return generateHashSignature(rawSignature);
};
