import { UserProps } from '../model/user.type';

export interface SignUpRequestProps extends Pick<UserProps, 'phoneNumber' | 'password'> {
  confirmPassword: UserProps['password'];
}
