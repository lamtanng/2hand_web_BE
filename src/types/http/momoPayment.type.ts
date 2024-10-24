export interface MoMoPaymentItemsProps {
  id: String;
  name: String;
  price: number;
  currency: 'VND';
  quantity: number;
  totalPrice: number;
  description?: String;
  category?: String;
  imageUrl?: String;
  manufacturer?: String;
  unit?: String;
  taxAmount?: number;
}

export interface MoMoPaymentUserInfoProps {
  name?: String;
  phoneNumber?: String;
  email?: String;
}

export interface CreateMoMoPaymentRequestProps {
  partnerCode: String;
  requestId: String;
  amount: number;
  orderId: String;
  orderInfo: String;
  redirectUrl: String;
  ipnUrl: String;
  requestType: String;
  extraData: string;
  lang: 'vi' | 'en';
  signature: String;
  storeId?: String;
  items?: MoMoPaymentItemsProps[];
  userInfo?: Object;
  autoCapture?: Boolean;
}

export interface CreateMoMoPaymentResponseProps
  extends Pick<CreateMoMoPaymentRequestProps, 'partnerCode' | 'requestId' | 'orderId' | 'amount'> {
  responseTime: String;
  message: String;
  resultCode: number;
  payUrl: String;
  shortLink: String;
}

export interface IPNMoMoPaymentRequestProps
  extends Pick<
    CreateMoMoPaymentRequestProps,
    'partnerCode' | 'requestId' | 'orderId' | 'amount' | 'orderInfo' | 'extraData' | 'signature'
  > {
  orderType: String;
  transId: String;
  resultCode: number;
  message: String;
  payType: 'qr' | 'webApp' | 'credit' | 'napas';
  responseTime: String;
}
