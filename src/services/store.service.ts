import { Request, Response } from 'express';
import { StoreModel } from '../models/store';
import { StoreDocument } from '../models/store/store.doc';
import { catchServiceFunc } from '../utils/catchErrors';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const stores = await StoreModel.find({}).populate('userID', 'email');
    return { stores };
  } catch (error) {
    console.error(error);
  }
};

const addStore = async (reqBody: StoreDocument, res: Response) => {
  try {
    const store = reqBody;

    const newStore = await StoreModel.create(store);
    return { newStore };
  } catch (error) {
    console.error(error);
  }
};

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

export const storeService = { findAll, addStore, findOneById, findOneByUserId };
