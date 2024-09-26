import mongoose from 'mongoose';

export interface AccountProps {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SignUpProps extends Pick<AccountProps, 'email' | 'password'> {
  confirmPassword: Pick<AccountProps, 'password'>;
}
