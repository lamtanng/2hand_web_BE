import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/user/user.model';
import { UserDocument } from '../models/user/user.schema';
import { RoleModel } from '../models/role/role.model';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const users = await UserModel.find()
      .populate('roleID', 'name')
      .populate('followerID', 'email')
      .populate('followingID', 'email')
      .exec();
    return { users };
  } catch (error) {
    console.error(error);
  }
};

const addUser = async (reqBody: UserDocument, res: Response) => {
  try {
    const user = reqBody;

    const roleID = await RoleModel.findOne({ name: 'Customer' }, { _id: 1 });
    console.log(roleID?._id);

    if (!roleID) {
      res.status(StatusCodes.NOT_FOUND);
    } else {
      user.roleID = [roleID._id];
    }

    const newUser = await UserModel.create(user);
    return { newUser };
  } catch (error) {
    console.error(error);
  }
};

export const userService = { findAll, addUser };
