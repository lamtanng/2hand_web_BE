import { AccountProps } from '../account.type';

export interface SignUpRequestProps extends Pick<AccountProps, 'email' | 'password'> {
  confirmPassword: Pick<AccountProps, 'password'>;
}
