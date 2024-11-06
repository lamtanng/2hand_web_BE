import mongoose from 'mongoose';
import { AddressProps } from './address.type';

export interface StoreProps {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  address: AddressProps[];
  avatar: string;
  coverImg: string;
  isActive: boolean;
  createAt?: Date;
  updateAt?: Date;
  userID: mongoose.Schema.Types.ObjectId;
  ghnStoreID: string;
}
