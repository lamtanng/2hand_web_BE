import mongoose from 'mongoose';
import { OrderProps } from '../model/order.type';
import { PaginationRequestProps } from './pagination.type';
import { MoMoPaymentItemsProps } from './momoPayment.type';

export interface FindAllOrdersResponseProps
  extends Pick<OrderProps, '_id' | 'userID' | 'orderStatusID' | 'paymentMethodID' | 'storeID'>,
    PaginationRequestProps {}

export interface CalcShippingFeeRequestProps {
  shopid: number;
  weight: number;
  service_type_id: number;
  from_district_id: number;
  from_ward_code: string;
  to_district_id: number;
  to_ward_code?: number;
}
export interface CalcShippingFeeResponseProps {
  code: number;
  message: string;
  data: any;
  code_message: string;
}

export interface CreatedOrderProps extends Pick<OrderProps, 'storeID' | 'total' | 'note' | 'shipmentCost'> {
  items: MoMoPaymentItemsProps[];
}
export interface CreateCODPaymentRequestProps
  extends Pick<OrderProps, 'userID' | 'total' | 'paymentMethodID' | 'receiverAddress'> {
  orders: CreatedOrderProps[];
}
