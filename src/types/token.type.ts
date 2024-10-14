import mongoose from 'mongoose';
import { UserProps } from './model/user.type';

export interface TokenProps {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedTokenProps extends Omit<UserProps, 'roleID'> {
  roleID: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  }[];
}
