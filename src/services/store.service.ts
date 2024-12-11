import { Request, Response } from 'express';
import { createGHNStoreAPI } from '../apis/ghn';
import { StoreModel } from '../models/store';
import { UserModel } from '../models/user';
import { AppError } from '../types/error.type';
import { CreateGHNStoreRequestProps } from '../types/http/ghn.type';
import { CreateStoreRequestProps, UpdateStoreRequestProps } from '../types/http/store.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { RoleModel } from '../models/role';
import { Role } from '../types/enum/role.enum';
import mongoose, { ObjectId } from 'mongoose';
import { OrderModel } from '../models/order';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import { ORDERSTAGE_COLLECTION_NAME } from '../models/orderStage/orderStage.doc';
import { get } from 'lodash';
import { ProductModel } from '../models/product';
import { adminService } from './admin.service';

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

const update = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.body as UpdateStoreRequestProps;
  const store = await StoreModel.findById(_id);
  const updatedStore = await StoreModel.findByIdAndUpdate(_id, { ...req.body }, { new: true });
  return updatedStore;
});

const statistics = catchServiceFunc(async (req: Request, res: Response) => {
  const storeID = parseJson(req.query.storeID as string);
  const startDate = parseJson(req.query.startDate as string);
  const endDate = parseJson(req.query.endDate as string);

  function getDateRanges(date: Date) {
    const newDate = new Date(date);
    console.log(newDate.getDate(), newDate.getDay());

    // Lấy ngày đầu tuần (Thứ Hai)
    const weekStart = new Date(newDate);
    weekStart.setDate(newDate.getDate() - newDate.getDay() + 1); // Thứ Hai là ngày 1
    if (newDate.getDay() === 0) {
      weekStart.setDate(newDate.getDate() - 6); // Chủ Nhật là ngày cuối cùng của tuần trước
    }

    // Lấy ngày cuối tuần (Chủ Nhật)
    const weekEnd = new Date(newDate);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Lấy ngày đầu tháng
    const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

    // Lấy ngày cuối tháng
    const monthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    // Lấy ngày đầu năm
    const yearStart = new Date(newDate.getFullYear(), 0, 1);

    // Lấy ngày cuối năm
    const yearEnd = new Date(newDate.getFullYear(), 11, 31);

    return { newDate, weekStart, weekEnd, monthStart, monthEnd, yearStart, yearEnd };
  }

  const datee = getDateRanges(new Date(2024, 11, 15, 12, 10, 0));

  const findQuery = {
    createdAt: {
      $gte: datee.yearStart,
      $lte: datee.yearEnd,
    },
    storeID: storeID ? new mongoose.Types.ObjectId(storeID) : null,
  };
  deleteEmptyObjectFields(findQuery);

  // count orders by stage
  const orders = await adminService.getOrderStatistics(findQuery);
  const productTotal = await ProductModel.find(findQuery).countDocuments();

  return { orders, productTotal };
});

export const storeService = {
  findAll,
  addStore,
  findOneById,
  findOneByUserId,
  createGHNStore,
  update,
  statistics,
};
