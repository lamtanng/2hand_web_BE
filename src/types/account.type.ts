import { Role } from './enum/role.enum';

export interface AccountProps {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: Role[];
}

export interface SignUpProps extends Pick<AccountProps, 'email' | 'password'> {
  confirmPassword: Pick<AccountProps, 'password'>;
}
