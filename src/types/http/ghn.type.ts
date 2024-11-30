import { ProductProps } from '../model/product.type';

export interface GHNResponseProps {
  code: number;
  message: string;
  data: any;
  code_message: string;
}

export interface CreateGHNStoreRequestProps {
  district_id: number;
  ward_code: string;
  name: string;
  phone: string;
  address: string;
  token?: string;
}

export interface CreateGHNStoreResponseProps {
  shop_id: number;
}

export interface GetAvailableServiceRequestProps {
  shop_id: number;
  from_district: number;
  to_district: number;
}

export interface GetAvailableServiceResponseProps extends GHNResponseProps {
  data: {
    service_id: number;
    short_name: string;
    service_type_id: number;
  }[];
}

export interface CalcShippingFeeItemProps
  extends Pick<ProductProps, 'name' | 'quantity' | 'height' | 'weight' | 'length' | 'width'> {}
