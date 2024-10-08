import { UserProps } from '../user.type';

export interface SignUpRequestProps extends Pick<UserProps, 'email' | 'password'> {
  confirmPassword: Pick<UserProps, 'password'>;
}
