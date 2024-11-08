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
