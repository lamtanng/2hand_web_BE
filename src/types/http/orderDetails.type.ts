import { OrderDetailProps } from '../model/orderDetail.type';

export interface CreateOrderDetailRequest extends Omit<OrderDetailProps, '_id'> {}
