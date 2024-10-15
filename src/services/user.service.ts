import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../constants/pagination';
import { RoleModel } from '../models/role';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { GetUsersResponseProps } from '../types/http/user.type';
import { UserProps } from '../types/model/user.type';
import ApiError from '../utils/classes/ApiError';

const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, skip } = pagination(req);
    const searchUserFilter = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
      ],
    };

    const users = await UserModel.find(searchUserFilter, {}, { limit, skip })
      .populate('roleID', 'name')
      .populate('followerID', 'email')
      .populate('followingID', 'email')
      .exec();

    const total = await UserModel.countDocuments(searchUserFilter);
    const response: GetUsersResponseProps = { page, limit, total, users };
    return response;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
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
