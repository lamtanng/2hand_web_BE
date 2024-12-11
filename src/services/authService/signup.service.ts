import { Request } from 'express';
import { RoleModel } from '../../models/role';
import { UserModel } from '../../models/user';
import { Role } from '../../types/enum/role.enum';
import { VerifyOtpRequestProps } from '../../types/http/otp.type';

export const signupService = async (req: Request) => {
  const { phoneNumber, password } = req.body as VerifyOtpRequestProps;
  const roleId = await RoleModel.findOne({ name: Role.Customer }, { _id: 1 });
  const user = new UserModel({ phoneNumber, password, roleID: [roleId?._id] });
  const newUser = await UserModel.create(user);
  return newUser;
};
