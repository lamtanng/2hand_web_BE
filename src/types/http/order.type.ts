import { OrderProps } from '../model/order.type';
import { PaginationRequestProps } from './pagination.type';

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
