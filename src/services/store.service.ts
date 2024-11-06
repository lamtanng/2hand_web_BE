import { Request, Response } from 'express';
import { createGHNStoreAPI } from '../apis/ghn';
import { StoreModel } from '../models/store';
import { CreateGHNStoreRequestProps } from '../types/http/ghn.type';
import { CreateStoreRequestProps } from '../types/http/store.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';

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
  if (!ghnStore) {
    throw new ApiError({
      message: ghnStore.code_message_value,
      statusCode: ghnStore.code,
    });
  }

  //create store
  const newStore = await StoreModel.create({ ...store, ghnStoreID: '123456' });
  return newStore;
});

const createGHNStore = catchServiceFunc(async (req: Request, res: Response) => {
  const { address, name, phoneNumber } = req.body as CreateStoreRequestProps;
  const data: CreateGHNStoreRequestProps = {
    district_id: address[0].district.DistrictID,
    ward_code: address[0].ward.WardCode,
    name,
    phone: phoneNumber,
    address: address[0].address,
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
