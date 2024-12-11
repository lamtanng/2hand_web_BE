import { Request } from 'express';
import { RoleModel } from '../../models/role';
import { UserModel } from '../../models/user';
import { Role } from '../../types/enum/role.enum';
import { SignUpRequestProps } from '../../types/http/signup.type';
import { formatPhoneNumber } from '../../utils/phone';

export const signupService = async (req: Request) => {
  const { phoneNumber, password } = req.body as SignUpRequestProps;
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
  const roleId = await RoleModel.findOne({ name: Role.Customer }, { _id: 1 });
  const user = new UserModel({
    phoneNumber: formattedPhoneNumber,
    password,
    roleID: [roleId?._id],
  });
  const newUser = await UserModel.create(user);
  return newUser;
};
