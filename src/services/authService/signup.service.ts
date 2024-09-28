import { AccountModel } from '../../models/account';
import { AccountProps, SignUpProps } from '../../types/account.type';
import { Role } from '../../types/enum/role.enum';
import { catchErrors } from '../../utils/catchErrors';

const signup = async (reqBody: SignUpProps) => {
  const account: AccountProps = {
    email: reqBody.email,
    password: reqBody.password,
    createdAt: new Date(),
    role: [Role.User],
  };

  const res = await AccountModel.create(account);
  const newAccount = await AccountModel.findById(res._id);

  return newAccount;
};

export const signupService = { signup };
