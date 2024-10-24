import { env } from '../config/environment';
import { ORDER_ROUTE, V1_ROUTE } from '../constants/routes';

const baseURL = 'https://test-payment.momo.vn/v2/gateway/api';
const accessKey = env.MOMO_ACCESS_KEY;
const secretKey = env.MOMO_SECRET_KEY;
const orderInfo = 'Pay with MoMo';
const partnerCode = 'MOMO';
const ipnUrl = `${env.MOMO_IPN_URL}${V1_ROUTE}${ORDER_ROUTE}/callback`;
const requestType = 'payWithMethod';
const extraData = '';
const autoCapture = true;
const lang = 'vi';
const redirectUrl = `${env.CLIENT_ORIGIN}/checkout`;
const algorithm = 'sha256';
const digest = 'hex';

export const MOMO = {
  baseURL,
  accessKey,
  secretKey,
  orderInfo,
  partnerCode,
  ipnUrl,
  requestType,
  extraData,
  autoCapture,
  lang,
  redirectUrl,
  algorithm,
  digest,
};
