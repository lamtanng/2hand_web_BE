import { UserProps } from '../model/user.type';
import { PaginationRequestProps, PaginationResponseProps } from './pagination.type';

export interface GetUsersRequestProps extends PaginationRequestProps {}
export interface GetUsersResponseProps extends PaginationResponseProps {
  users: UserProps[];
}
