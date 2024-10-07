import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { HttpMessage } from '../../constants/httpMessage';
import { UserProps } from '../../types/user.type';
import { compareHash, hashValue } from '../../utils/bcrypt';
import ApiError from '../../utils/classes/ApiError';
import { IUserModel, IUserQueries, USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA } from './user.doc';

//middleware
USER_COLLECTION_SCHEMA.pre('save', async function () {
  // check if the password is modified. If it is'nt, do nothing to save some processing time
  if (this.isModified('password')) {
    this.password = await hashValue(this.password);
  }
});

//methods
USER_COLLECTION_SCHEMA.methods.comparePassword = async function (password: string) {
  return await compareHash(password, this.password);
};

//functions
USER_COLLECTION_SCHEMA.statics.findByEmail = async function (email: string) {
  const existUser = await this.findOne({ email });
  if (!existUser) {
    return new ApiError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }
  return existUser;
};

export const UserModel = mongoose.model<UserProps, IUserModel, IUserQueries>(
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
);
