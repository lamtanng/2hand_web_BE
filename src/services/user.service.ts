import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RoleModel } from '../models/role';
import { UserModel } from '../models/user';
import { UserProps } from '../types/user.type';

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

const addUser = async (reqBody: UserProps, res: Response) => {
  try {
    const user = reqBody;

    const roleID = await RoleModel.findOne({ name: 'Customer' }, { _id: 1 });

    if (!roleID) {
      res.status(StatusCodes.NOT_FOUND);
      return;
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
