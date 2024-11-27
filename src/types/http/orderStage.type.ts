import { OrderStageProps } from '../model/orderStage.type';
import { OrderStageStatusProps } from '../model/orderStageStatus.type';

export interface CreateOrderStageRequest
  extends Pick<OrderStageProps, 'name' | 'orderID'>,
    Pick<OrderStageStatusProps, 'expectedDate'> {}
