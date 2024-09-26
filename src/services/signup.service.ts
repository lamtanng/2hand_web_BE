import { AccountModel } from '../models/account';
import { SignUpProps } from '../types/account.type';

const signup = async (reqBody: SignUpProps) => {
  const account = {
    email: reqBody.email,
    password: reqBody.password,
    createdAt: new Date(),
  };
  const res = await AccountModel.create(account);
  const newAccount = await AccountModel.findById(res._id);
  console.log('compare:', await res.comparePassword('123456'));

  return newAccount;
};

export const signupService = { signup };
