import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { sendOTPSms } from '../apis/sms';
import { HttpMessage } from '../constants/httpMessage';
import { pagination } from '../constants/pagination';
import { OTPVerificationModel } from '../models/otpVerification';
import { RoleModel } from '../models/role';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { AddressRequestProps, DeleteAddressRequestProps } from '../types/http/address.type';
import {
  SendOtpRequestProps,
  SendSmsOtpRequestProps,
  VerifySmsOtpRequestProps,
} from '../types/http/otp.type';
import {
  GetUsersResponseProps,
  ResetPasswordRequestProps,
  UpdateUserInfoRequestProps,
} from '../types/http/user.type';
import { UserProps } from '../types/model/user.type';
import { hashValue } from '../utils/bcrypt';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { generateOTP } from '../utils/otp';
import { formatPhoneNumber } from '../utils/phone';
import _ from 'lodash';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
import { avatarFolder } from '../constants/cloudinaryFolder';
import { UploadApiResponse } from 'cloudinary';
import { PaginationResponseProps } from '../types/http/pagination.type';
import { JwtProvider } from '../providers/JwtProvider';
import { verifyAccessToken } from '../utils/jwt';
import { emailTransporter } from '../constants/emailTransporter';
import { mailOptions } from '../utils/mailOptions';
import { env } from '../config/environment';
import { EmailType } from '../types/enum/emailType.enum';

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
    const response: PaginationResponseProps = { page, limit, total, data: users };
    return response;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const addUser = catchServiceFunc(async (req: Request, res: Response) => {
  const user = req.body;
  const roleID = await RoleModel.findOne({ name: 'Customer' }, { _id: 1 });

  if (!roleID) {
    res.status(StatusCodes.NOT_FOUND);
    return;
  } else {
    user.roleID = [roleID._id];
  }
  const newAvatar = user?.avatar ? await uploadAvatarImages({ files: [user.avatar] }) : '';
  const newUser = await UserModel.create({ ...user, avatar: newAvatar });
  return { newUser };
});

const updateUserInfo = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, firstName, lastName, dateOfBirth, avatar } = req.body as UpdateUserInfoRequestProps;
  const newAvatar = avatar ? await uploadAvatarImages({ files: [avatar] }) : '';
  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { firstName, lastName, dateOfBirth, avatar: newAvatar },
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
  const { addressID, _id } = req.body as DeleteAddressRequestProps;

  const user = await UserModel.findOne({ _id });
  if (!user) {
    return new ApiError({
      message: HttpMessage.NOT_FOUND.USER,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }
  const removedAddress = _.remove(
    user.address,
    ({ _id, isDefault }) => String(_id) === String(addressID) && !isDefault,
  );

  if (!removedAddress.length) {
    return new ApiError({
      message: HttpMessage.NOT_FOUND.ADDRESS,
      statusCode: StatusCodes.NOT_FOUND,
    }).rejectError();
  }
  return await UserModel.findByIdAndUpdate({ _id }, { address: user.address }, { new: true });
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID } = req.params;
  const user = await getUserById(userID);
  return user;
});

const findOneBySlug = catchServiceFunc(async (req: Request, res: Response) => {
  const { slug } = req.query;
  const user = await UserModel.findOne({ slug });
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
  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id },
    { phoneNumber: formattedPhoneNumber },
    { new: true },
  );
  return updatedUser;
});

const sendOtpVerificationEmail = catchServiceFunc(async (req: Request, res: Response) => {
  const { email } = req.body as SendOtpRequestProps;
  if (!email) {
    throw new ApiError({
      message: ReasonPhrases.BAD_REQUEST,
      statusCode: StatusCodes.BAD_REQUEST,
    });
    return;
  }

  const otp = generateOTP();
  await emailTransporter.sendMail(
    mailOptions.getEmailVerificationOptions({
      to: email,
      OTPCode: otp,
    }),
  );
  console.log('>>>>');
  const hashedOtp = await hashValue(String(otp));
  return await OTPVerificationModel.create({ otp: hashedOtp, email });
});

// const sendSmsResetPassword = catchServiceFunc(async (req: Request, res: Response) => {
//   const { _id, email, slug } = (await verifyAccessToken(req.cookies?.accessToken)) as UserProps;
//   // const {} = await getUserById(_id);

//   await emailTransporter.sendMail(
//     mailOptions.getResetPasswordOptions({
//       to: email,
//       resetUrl: `${env.CLIENT_ORIGIN}/reset-password/${slug}`,
//     }),
//   );

//   const hashedOtp = await hashValue(String(otp));
//   await OTPVerificationModel.create({ otp: hashedOtp, phoneNumber: formattedPhoneNumber });

//   return result;
// });

const resetPassword = catchServiceFunc(async (req: Request, res: Response) => {
  const { email, password } = req.body as ResetPasswordRequestProps;
  const hashedPassword = await hashValue(password);
  //replace with email
  const updatedUser = await UserModel.findOneAndUpdate(
    { phoneNumber: email },
    { password: hashedPassword },
    { new: true },
  );
  return updatedUser;
});

const uploadAvatarImages = async ({ files }: Pick<UploadCloudinaryProps, 'files'>) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder: avatarFolder,
    resource_type: 'image',
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url)[0];
};

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
  findOneBySlug,
  sendOtpVerificationEmail,
  resetPassword,
};
