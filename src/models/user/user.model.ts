import mongoose from 'mongoose';
import { USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA, UserDocument } from './user.schema';

export const UserModel = mongoose.model<UserDocument>(USER_COLLECTION_NAME, USER_COLLECTION_SCHEMA);
