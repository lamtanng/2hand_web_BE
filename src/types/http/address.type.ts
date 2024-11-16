import mongoose from 'mongoose';
import { AddressProps } from '../model/address.type';

export interface GetDistrictRequestProps {
  province_id?: number;
}
export interface GetWardRequestProps {
  district_id?: number;
}

export interface AddressRequestProps {
  _id: mongoose.Types.ObjectId;
  address: AddressProps;
}

export interface DeleteAddressRequestProps {
  _id: mongoose.Types.ObjectId;
  addressID: mongoose.Types.ObjectId;
}
