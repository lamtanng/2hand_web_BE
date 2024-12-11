import { OrderRequestProps } from '../model/orderRequest.type';
import { OrderStageProps } from '../model/orderStage.type';
import { OrderStageStatusProps } from '../model/orderStageStatus.type';

export interface  CreateOrderRequestRequest
  extends Omit<OrderRequestProps, '_id' | 'replyMessage' | 'replyStatus' | 'orderStageStatusID'>,
    Pick<OrderStageProps, 'name'>,
    Pick<OrderStageStatusProps, 'status' | 'orderStageID'> {}

export interface ReplyOrderRequestRequest
  extends Pick<OrderRequestProps, '_id' | 'replyMessage' | 'replyStatus'> {}
