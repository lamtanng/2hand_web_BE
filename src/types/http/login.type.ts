import { TokenProps } from '../token.type';
import { UserProps } from '../model/user.type';

export interface LoginRequestProps extends Pick<UserProps, 'phoneNumber' | 'password'> {}
export interface LoginResponseProps extends TokenProps {}
