export interface CreateGHNStoreRequestProps {
  district_id: number;
  ward_code: number;
  name: string;
  phone: string;
  address: string;
  token?: string;
}
export interface CreateGHNStoreResponseProps {
  shop_id: number;
}
