import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose, { ObjectId } from 'mongoose';
import { HttpMessage } from '../constants/httpMessage';
import { pagination } from '../constants/pagination';
import { RoleModel } from '../models/role';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { AddressRequestProps } from '../types/http/address.type';
import { GetUsersResponseProps, UpdateUserInfoRequestProps } from '../types/http/user.type';
import { AddressProps } from '../types/model/address.type';
import { UserProps } from '../types/model/user.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { sendOTPSms } from '../apis/sms';
import { SendSmsOtpRequestProps, VerifySmsOtpRequestProps } from '../types/http/otp.type';
import { generateOTP } from '../utils/otp';
import { compareHash, hashValue } from '../utils/bcrypt';
import { OTPVerificationModel } from '../models/otpVerification';
import { parsePhoneNumber } from 'libphonenumber-js';
import { formatPhoneNumber } from '../utils/phone';

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
  const { _id, firstName, lastName, dateOfBirth } = req.body as UpdateUserInfoRequestProps;

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { firstName, lastName, dateOfBirth },
    { new: true },
  );
  return updatedUser;
});

const createReceiveAddress = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, address } = req.body as AddressRequestProps;
  const user = await getUserById(_id);

  if (address.isDefault) {
    user.address = user.address.map((address) => ({ ...address, isDefault: false }));
  }
  user?.address.push({ ...address, _id: new mongoose.Types.ObjectId() });
  return await user?.save();
});

const updateAddress = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, address } = req.body as AddressRequestProps;
  const user = await getUserById(_id);

  if (address.isDefault) {
    user.address = user.address.map((address) => ({ ...address, isDefault: false }));
  }

  user.address = user?.address.map((item) =>
    String(item._id) === String(address._id) ? address : item,
  );
  return await user.save();
});

const deleteAddress = catchServiceFunc(async (req: Request, res: Response) => {
  const { addressID, _id } = req.body;

  const result = await UserModel.findOneAndUpdate(
    { _id },
    { $pull: { address: { $elemMatch: { isDefault: true } } } },
    { new: true },
  );

  // const result = await UserModel.find({
  //   _id,
  //   "address.isDefault":  {$ne: true} ,
  //   // 'address.address': {$eq: 'duong so 10002'},
  // });
  console.log(result);

  // if (result.modifiedCount === 0) {
  //   return new ApiError({
  //     message: 'Address is default or not found',
  //     statusCode: StatusCodes.NOT_FOUND,
  //   }).rejectError();
  // }

  return result;
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID } = req.params;
  const user = await getUserById(userID);
  return user;
});

const getUserById = async (
  _id: string | mongoose.Schema.Types.ObjectId | mongoose.Types.ObjectId,
) => {
  const user = await UserModel.findById({ _id });

  if (!user)
    return new ApiError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();

  return user;
};

const sendSmsOtp = catchServiceFunc(async (req: Request, res: Response) => {
  const { phoneNumber } = req.body as SendSmsOtpRequestProps;
  const otp = generateOTP();
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  const result = await sendOTPSms({ phoneNumber: formattedPhoneNumber, otp });

  const hashedOtp = await hashValue(String(otp));
  await OTPVerificationModel.create({ otp: hashedOtp, phoneNumber: formattedPhoneNumber });

  return result;
});

const createUserPhone = catchServiceFunc(async (req: Request, res: Response) => {
  const { phoneNumber, _id } = req.body as VerifySmsOtpRequestProps;
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { phoneNumber: phoneNumber },
    { new: true },
  );
  return updatedUser;
});

export const userService = {
  findAll,
  addUser,
  updateUserInfo,
  createReceiveAddress,
  updateAddress,
  deleteAddress,
  findOneById,
  sendSmsOtp,
  createUserPhone,
};
