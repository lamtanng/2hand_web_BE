import { TokenProps } from '../token.type';
import { UserProps } from '../user.type';

export interface LoginRequestProps extends Pick<UserProps, 'email' | 'password'> {}
export interface LoginResponseProps extends TokenProps {}
