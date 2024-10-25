import { OrderProps } from '../model/order.type';
import { PaginationRequestProps } from './pagination.type';

export interface FindAllOrdersResponseProps
  extends Pick<OrderProps, '_id' | 'userID' | 'orderStatusID' | 'paymentMethodID' | 'storeID'>,
    PaginationRequestProps {}
