import mongoose from 'mongoose';
import { AddressProps } from './address.type';

export interface OrderProps {
  _id: mongoose.Types.ObjectId;
  exprDate: Date;
  receiverAddress: AddressProps;
  note: string;
  total: number;
  shipmentCost: number;
  userID: mongoose.Schema.Types.ObjectId;
  storeID: mongoose.Schema.Types.ObjectId;
  orderDetailIDs: mongoose.Schema.Types.ObjectId[];
  orderStageID: mongoose.Schema.Types.ObjectId;
  paymentMethodID: mongoose.Schema.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
