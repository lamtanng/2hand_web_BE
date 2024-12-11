import { UserProps } from '../model/user.type';
import { PaginationRequestProps, PaginationResponseProps } from './pagination.type';
import { SignUpRequestProps } from './signup.type';

export interface GetUsersRequestProps extends PaginationRequestProps {}

export interface GetUsersResponseProps extends PaginationResponseProps {
  users: UserProps[];
}

export interface UpdateUserInfoRequestProps
  extends Pick<UserProps, '_id' | 'firstName' | 'lastName' | 'dateOfBirth' | 'avatar'> {}

export interface ResetPasswordRequestProps extends SignUpRequestProps {}
