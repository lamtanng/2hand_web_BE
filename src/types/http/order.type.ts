import { OrderProps } from '../model/order.type';
import { CalcShippingFeeItemProps, GHNResponseProps } from './ghn.type';
import { MoMoPaymentItemsProps } from './momoPayment.type';
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
  insurance_value?: number;
  height?: number;
  length?: number;
  width?: number;
  cod_value?: number;
  items?: CalcShippingFeeItemProps[];
}
export interface CalcShippingFeeResponseProps extends GHNResponseProps {
  data: {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    coupon_value: number;
    r2s_fee: number;
    return_again: number;
    document_return: number;
    double_check: number;
    cod_fee: number;
    pick_remote_areas_fee: number;
    deliver_remote_areas_fee: number;
    cod_failed_fee: number;
  };
}

export interface CreatedOrderProps
  extends Pick<OrderProps, 'storeID' | 'total' | 'note' | 'shipmentCost'> {
  items: MoMoPaymentItemsProps[];
}
export interface CreateCODPaymentRequestProps
  extends Pick<OrderProps, 'userID' | 'total' | 'paymentMethodID' | 'receiverAddress'> {
  orders: CreatedOrderProps[];
}
