import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../constants/pagination';
import { RoleModel } from '../models/role';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { GetUsersResponseProps, UpdateUserInfoRequestProps } from '../types/http/user.type';
import { AddressProps, UserProps } from '../types/model/user.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';

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

const updateUserInfo = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, email, firstName, lastName, phoneNumber, dateOfBirth } =
    req.body as UpdateUserInfoRequestProps;

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { email, firstName, lastName, phoneNumber, dateOfBirth },
    { new: true },
  );
  return updatedUser;
});

const createReceiveAddress = catchServiceFunc(async (req: Request, res: Response) => {
  const newAddress = req.body as AddressProps;
  const { _id } = (await verifyAccessToken(req.cookies.accessToken)) as UserProps;
  const user = await UserModel.findById({ _id });

  if (newAddress.isDefault && user) {
    user.address = user.address.map((address) => ({ ...address, isDefault: false }));
  }
  user?.address.push(newAddress);
  return await user?.save();
});

export const userService = { findAll, addUser, updateUserInfo, createReceiveAddress };
