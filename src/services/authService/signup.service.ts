import { UserModel } from '../../models/user';
import { SignUpRequestProps } from '../../types/http/signup.type';

const signup = async (reqBody: SignUpRequestProps) => {
  return await UserModel.create(reqBody);
};

export const signupService = { signup };
