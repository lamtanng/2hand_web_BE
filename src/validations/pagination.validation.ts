import Joi from 'joi';
import { PaginationRequestProps } from '../types/http/pagination.type';

export const paginationSchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
  search: Joi.string().trim().allow('', null),
});
