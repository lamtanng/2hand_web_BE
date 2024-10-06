import { UserProps } from '../user.type';

export interface SignUpRequestProps extends Pick<UserProps, 'email' | 'password' | 'phoneNumber'> {
  confirmPassword: Pick<UserProps, 'password'>;
}
