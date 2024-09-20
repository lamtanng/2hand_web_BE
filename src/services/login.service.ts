import { accountModel } from '../models/account.model';
import { AccountProps } from '../types/account.type';
import { AppError } from '../types/error.type';

const login = async (reqBody: AccountProps) => {
  try {
    const reqData = { ...reqBody };

    const createAccount = await accountModel.createAccount(reqData);
    const newAccount = accountModel.findOneById(createAccount.insertedId);
    return newAccount;
  } catch (error: AppError) {
    //Turn the error to the controller layer to handle it
    throw error;
  }
};

export const loginService = { login };
