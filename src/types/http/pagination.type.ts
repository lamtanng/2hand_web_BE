export interface PaginationRequestProps {
  page?: number;
  limit?: number;
  search?: string;
}
export interface PaginationResponseProps {
  page: number;
  limit: number;
  total: number;
  data: any[];
}
