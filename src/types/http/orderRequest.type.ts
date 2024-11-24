import { OrderRequestProps } from '../model/orderRequest.type';

export interface CreateOrderRequestRequest
  extends Omit<OrderRequestProps, '_id' | 'replyMessage'> {}
