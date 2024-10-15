import { Request } from 'express';
import { PaginationRequestProps } from '../types/http/pagination.type';

const defaultPage = 1;
const defaultLimit = 10;
const defaultSearch = '';

export const pagination = (req: Request) => {
  const { page, limit, search } = req.query as PaginationRequestProps;
  const pageQuery = (page || defaultPage) as number;
  const limitQuery = (limit || defaultLimit) as number;
  const searchQuery = search || defaultSearch;
  const skipQuery = ((pageQuery - 1) * limitQuery) as number;

  return {
    page: pageQuery,
    limit: limitQuery,
    search: searchQuery,
    skip: skipQuery,
  };
};
