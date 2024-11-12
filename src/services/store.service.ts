import { Request, Response } from 'express';
import { createGHNStoreAPI } from '../apis/ghn';
import { StoreModel } from '../models/store';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { CreateGHNStoreRequestProps } from '../types/http/ghn.type';
import { CreateStoreRequestProps } from '../types/http/store.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { RoleModel } from '../models/role';
import { Role } from '../types/enum/role.enum';
import { ObjectId } from 'mongoose';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const stores = await StoreModel.find({}).populate('userID', 'email');
    return { stores };
  } catch (error) {
    console.error(error);
  }
};

const addStore = catchServiceFunc(async (req: Request, res: Response) => {
  const store = req.body as CreateStoreRequestProps;
  //create ghn store
  const ghnStore = await storeService.createGHNStore(req, res);

  if (ghnStore.code !== 200) {
    throw new ApiError({
      message: ghnStore.message,
      statusCode: ghnStore.code,
    });
  }

  const session = await StoreModel.startSession();
  session.startTransaction();

  try {
    await UserModel.findByIdAndUpdate(store.userID, {
      phoneNumber: store.phoneNumber,
    });

    const newStore = await StoreModel.create({ ...store, ghnStoreID: ghnStore.data.shop_id });
    //add seller role to user
    const sellerRoleID = await RoleModel.findOne({ name: Role.Seller }).lean();
    await UserModel.findByIdAndUpdate(store.userID, {
      $push: { roleID: sellerRoleID?._id as ObjectId },
    });

    await session.commitTransaction();
    return newStore;
  } catch (error: AppError) {
    await session.abortTransaction();
    throw new ApiError({
      message: error.message,
      statusCode: error.statusCode,
    });
  } finally {
    session.endSession();
  }
});

const createGHNStore = catchServiceFunc(async (req: Request, res: Response) => {
  const { address, name, phoneNumber } = req.body as CreateStoreRequestProps;
  const data: CreateGHNStoreRequestProps = {
    district_id: address[0].district.DistrictID,
    ward_code: address[0].ward.WardCode,
    name,
    phone: phoneNumber,
    address: address[0].address || '',
  };
  const ghnStore = await createGHNStoreAPI(data);
  return ghnStore;
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { storeID } = req.params;
  const store = await StoreModel.findById(storeID).populate('userID');
  return store;
});

const findOneByUserId = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID } = req.params;
  const store = await StoreModel.findOne({ userID }).populate('userID');
  return store;
});

export const storeService = { findAll, addStore, findOneById, findOneByUserId, createGHNStore };
