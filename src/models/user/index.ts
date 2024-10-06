import mongoose from 'mongoose';
import { compareHash, hashValue } from '../../utils/bcrypt';
import { USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA, UserDocument } from './user.doc';

//middleware
USER_COLLECTION_SCHEMA.pre('save', async function () {
  // check if the password is modified. If it is'nt, do nothing to save some processing time
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }

  // this.updatedAt = new Date();
  // this.createdAt ??= new Date(); // if the createdAt is null, assign the current date
});

//methods
USER_COLLECTION_SCHEMA.methods.comparePassword = async function (password: string) {
  return await compareHash(password, this.password);
};

export const UserModel = mongoose.model<UserDocument>(USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA);
