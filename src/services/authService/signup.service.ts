import { RoleModel } from '../../models/role';
import { UserModel } from '../../models/user';
import { Role } from '../../types/enum/role.enum';
import { SignUpRequestProps } from '../../types/http/signup.type';

export const signupService = async (reqBody: SignUpRequestProps) => {
  const roleId = await RoleModel.findOne({ name: Role.Customer }, { _id: 1 });
  const user = new UserModel({ ...reqBody, roleID: [roleId?._id] });
  const newUser = await UserModel.create(user);
  return newUser;
};
