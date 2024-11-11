import mongoose from 'mongoose';

export enum GHNSupportType {
  'BLOCK' = 0,
  'Pick/Return' = 1,
  'Delivery' = 2,
  'Pick/Return/Delivery' = 3,
}

export interface GHNAddressProps {
  NameExtension?: string[];
  CanUpdateCOD?: boolean;
  Status?: number;
}

export interface ProvincesAddressProps extends GHNAddressProps {
  ProvinceID: number;
  ProvinceName: string;
  CountryID?: number;
  Code?: number;
}

export interface DistrictAddressProps extends GHNAddressProps {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  SupportType?: GHNSupportType;
}

export interface WardAddressProps extends GHNAddressProps {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  SupportType?: GHNSupportType;
}

export interface AddressProps {
  _id: mongoose.Types.ObjectId;
  address: string;
  ward: WardAddressProps;
  district: DistrictAddressProps;
  province: ProvincesAddressProps;
  isDefault: boolean;
}
