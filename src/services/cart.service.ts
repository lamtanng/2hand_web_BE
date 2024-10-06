import { Request, Response } from 'express';
import { CartModel } from '../models/cart';
import { CartDocument } from '../models/cart/cart.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cart = await CartModel.find({});
    return { cart };
  } catch (error) {
    console.error(error);
  }
};

const addCart = async (reqBody: CartDocument, res: Response) => {
  try {
    const cart = reqBody;

    const newCart = await CartModel.create(cart);
    return { newCart };
  } catch (error) {
    console.error(error);
  }
};

export const cartService = { findAll, addCart };
