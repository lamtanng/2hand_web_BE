import { AccountModel } from '../../models/account';
import { AccountProps } from '../../types/account.type';
import { Role } from '../../types/enum/role.enum';
import { SignUpRequestProps } from '../../types/http/signup.type';
import { catchErrors } from '../../utils/catchErrors';

const signup = async (reqBody: SignUpRequestProps) => {
  const account = new AccountModel({
    email: reqBody.email,
    password: reqBody.password,
  });

  const res = await AccountModel.create(account);
  const newAccount = await AccountModel.findById(res._id);

  return newAccount;
};

export const signupService = { signup };
