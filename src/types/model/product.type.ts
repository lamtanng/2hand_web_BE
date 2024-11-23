import mongoose from 'mongoose';
import { AddressProps } from './address.type';

export interface ProductProps {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  image: string[];
  price: number;
  quantity: number;
  quality: string;
  slug: string;
  isActive: boolean;
  isPublish: boolean;
  createAt?: Date;
  updateAt?: Date;
  cateID: mongoose.Schema.Types.ObjectId;
  storeID: mongoose.Schema.Types.ObjectId;
  weight: number;
  height: number;
  width: number;
  length: number;
  address: AddressProps;
}
