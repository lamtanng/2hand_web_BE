import mongoose, { Model, Schema } from 'mongoose';
import {
  AddressProps,
  DistrictAddressProps,
  GHNSupportType,
  ProvincesAddressProps,
  WardAddressProps,
} from '../../types/model/address.type';

export interface IAddressMethods {}
export interface IAddressStatics {}
export interface IAddressQueries {}
export interface IAddressModel extends Model<AddressProps, IAddressQueries, IAddressMethods> {}

const PROVINCE_ADDRESS_SCHEMA = new Schema<ProvincesAddressProps>({
  ProvinceID: {
    type: Number,
    required: true,
  },
  ProvinceName: {
    type: String,
    required: true,
  },
  CountryID: {
    type: Number,
  },
  Code: {
    type: Number,
  },
  CanUpdateCOD: {
    type: Boolean,
  },
  NameExtension: {
    type: [String],
  },
  Status: {
    type: Number,
  },
});

const DISTRICT_ADDRESS_SCHEMA = new Schema<DistrictAddressProps>({
  DistrictID: {
    type: Number,
    required: true,
  },
  ProvinceID: {
    type: Number,
    required: true,
  },
  DistrictName: {
    type: String,
    required: true,
  },
  SupportType: {
    type: String,
    enum: {
      values: [
        GHNSupportType.BLOCK,
        GHNSupportType['Pick/Return'],
        GHNSupportType.Delivery,
        GHNSupportType['Pick/Return/Delivery'],
      ],
    },
  },
  CanUpdateCOD: {
    type: Boolean,
  },
  NameExtension: {
    type: [String],
  },
  Status: {
    type: Number,
  },
});

const WARD_ADDRESS_SCHEMA = new Schema<WardAddressProps>({
  WardCode: {
    type: String,
    required: true,
  },
  DistrictID: {
    type: Number,
    required: true,
  },
  WardName: {
    type: String,
    required: true,
  },
  SupportType: {
    type: String,
    enum: {
      values: [
        GHNSupportType.BLOCK,
        GHNSupportType['Pick/Return'],
        GHNSupportType.Delivery,
        GHNSupportType['Pick/Return/Delivery'],
      ],
    },
  },
  CanUpdateCOD: {
    type: Boolean,
  },
  NameExtension: {
    type: [String],
  },
  Status: {
    type: Number,
  },
});

export const ADDRESS_COLLECTION_NAME = 'address';
export const ADDRESS_COLLECTION_SCHEMA = new Schema<AddressProps>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
  address: {
    type: String,
    required: true,
  },
  province: {
    type: PROVINCE_ADDRESS_SCHEMA,
    required: true,
  },
  district: {
    type: DISTRICT_ADDRESS_SCHEMA,
    required: true,
  },
  ward: {
    type: WARD_ADDRESS_SCHEMA,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});
