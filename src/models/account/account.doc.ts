import { Schema } from 'mongoose';
import { AccountProps } from '../../types/account.type';
import { Role } from '../../types/enum/role.enum';

export interface AccountDocument extends AccountProps, Document {
  comparePassword: (password: string) => Promise<boolean>;
}

export const ACCOUNT_COLLECTION_NAME = 'accounts';
export const ACCOUNT_COLLECTION_SCHEMA = new Schema<AccountDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: [String], enum: Role, default: [Role.User] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);
