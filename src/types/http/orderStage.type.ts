import mongoose from 'mongoose';
import { OrderStageProps } from '../model/orderStage.type';

export interface CreateOrderStageRequest extends Pick<OrderStageProps, 'name' | 'orderID'> {}
