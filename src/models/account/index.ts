import mongoose from 'mongoose';
import { compareHash, hashValue } from '../../utils/bcrypt';
import { ACCOUNT_COLLECTION_NAME, ACCOUNT_COLLECTION_SCHEMA, AccountDocument } from './account.schema';

//middleware
ACCOUNT_COLLECTION_SCHEMA.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }
});

//methods
ACCOUNT_COLLECTION_SCHEMA.methods.comparePassword = async function (password: string) {
  return await compareHash(password, this.password);
};

export const AccountModel = mongoose.model<AccountDocument>(
  ACCOUNT_COLLECTION_NAME,
  ACCOUNT_COLLECTION_SCHEMA,
);
