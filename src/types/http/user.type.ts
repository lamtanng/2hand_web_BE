import { UserProps } from '../model/user.type';
import { PaginationRequestProps, PaginationResponseProps } from './pagination.type';

export interface GetUsersRequestProps extends PaginationRequestProps {}
export interface GetUsersResponseProps extends PaginationResponseProps {
  users: UserProps[];
}

export interface UpdateUserInfoRequestProps
  extends Pick<UserProps,'_id'| 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'dateOfBirth'> {}
