import { Request, Response } from 'express';
import { StoreModel } from '../models/store/store.model';
import { StoreDocument } from '../models/store/store.schema';

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
    return {newStore};
  } catch (error) {
    console.error(error);
  }
}

export const storeService = { findAll, addStore };
