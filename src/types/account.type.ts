import { ObjectId } from 'mongoose';
import { Role } from './enum/role.enum';

export interface AccountProps {
  id?: string | ObjectId;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: Role[];
}
