import Joi from 'joi';
import { AccountProps } from '../types/account.type';
import { getDB } from '../config/mongodb';
import { ObjectId } from 'mongodb';
import { AppError } from '../types/error.type';

const ACCOUNT_COLLECTION_NAME = 'accounts';
const ACCOUNT_COLLECTION_SCHEMA = Joi.object<AccountProps>({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).required().trim().strict(),
});

const createAccount = async (account: AccountProps) => {
  try {
    validateAccount(account);
    return await getDB().collection(ACCOUNT_COLLECTION_NAME).insertOne(account);
  } catch (error: AppError) {
    throw new Error(error);
  }
};

const findOneById = async (id: ObjectId) => {
  try {
    await getDB().collection(ACCOUNT_COLLECTION_NAME).findOne({ _id: id });
  } catch (error: AppError) {
    throw new Error(error);
  }
};

const validateAccount = async (account: AccountProps) =>
  ACCOUNT_COLLECTION_SCHEMA.validateAsync(account);

export const accountModel = {
  ACCOUNT_COLLECTION_NAME,
  ACCOUNT_COLLECTION_SCHEMA,
  createAccount,
  findOneById,
};
