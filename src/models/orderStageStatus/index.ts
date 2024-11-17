import { Model, Schema } from 'mongoose';
import { OrderStageStatusProps } from '../../types/model/orderStageStatus.type';

export interface IOrderStageStatusMethods {
  comparePassword: (password: string) => Promise<boolean>;
}
export interface IOrderStageStatusStatics {
  findByEmail: (email: string) => any;
}
export interface IOrderStageStatusQueries {
  paginate: (page: number, limit: number) => any;
}
export interface IOrderStageStatusModel
  extends Model<OrderStageStatusProps, IOrderStageStatusQueries, IOrderStageStatusMethods> {}

export const ORDERSTAGESTATUS_COLLECTION_NAME = 'orderStageStatuses';
export const ORDERSTAGESTATUS_COLLECTION_SCHEMA = new Schema<IOrderStageStatusModel>({});
