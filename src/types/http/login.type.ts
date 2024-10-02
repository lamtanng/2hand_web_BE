import { AccountProps } from '../account.type';

export interface LoginRequestProps extends Pick<AccountProps, 'email' | 'password'> {}
export interface LoginResponseProps extends Pick<AccountProps, 'id' | 'email' | 'role'> {
  accessToken: string;
  refreshToken: string;
}
