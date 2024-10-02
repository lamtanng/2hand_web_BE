import mongoose from 'mongoose';
import { ACCOUNT_COLLECTION_NAME, ACCOUNT_COLLECTION_SCHEMA, AccountDocument } from './account.doc';
import { compareHash, hashValue } from '../../utils/bcrypt';

//middleware
ACCOUNT_COLLECTION_SCHEMA.pre('save', async function () {
  // check if the password is modified. If it is'nt, do nothing to save some processing time
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }

  this.updatedAt = new Date();
  this.createdAt ??= new Date(); // if the createdAt is null, assign the current date
});

//methods
ACCOUNT_COLLECTION_SCHEMA.methods.comparePassword = async function (password: string) {
  return await compareHash(password, this.password);
};

export const AccountModel = mongoose.model<AccountDocument>(
  ACCOUNT_COLLECTION_NAME,
  ACCOUNT_COLLECTION_SCHEMA,
);
