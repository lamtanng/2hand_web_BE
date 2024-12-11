import mongoose from 'mongoose';
import { OrderStageStatusProps } from '../model/orderStageStatus.type';

export interface CreateOrderStageStatusRequest extends Omit<OrderStageStatusProps, '_id'> {}
export interface UpdateDateRequest
  extends Pick<OrderStageStatusProps, '_id' | 'date'> {}
