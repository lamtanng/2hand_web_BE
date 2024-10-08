import { UserProps } from '../model/user.type';

export interface SignUpRequestProps extends Pick<UserProps, 'email' | 'password'> {
  confirmPassword: Pick<UserProps, 'password'>;
}
