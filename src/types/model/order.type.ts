import mongoose from 'mongoose';
import { AddressProps } from './address.type';

export interface OrderProps {
  _id: mongoose.Types.ObjectId;
  exprDate: Date;
  receiverAddress: AddressProps;
  note: string;
  total: number;
  shipmentCost: number;
  userID: mongoose.Types.ObjectId;
  storeID: mongoose.Types.ObjectId;
  orderDetailIDs: mongoose.Types.ObjectId[];
  orderStageID: mongoose.Types.ObjectId;
  paymentMethodID: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
