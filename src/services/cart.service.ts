import { Request, Response } from 'express';
import { CartModel } from '../models/cart';
import { CartDocument } from '../models/cart/cart.doc';
import { AppError } from '../types/error.type';
import { UserProps } from '../types/model/user.type';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';

const findAll = async (req: Request, res: Response) => {
  try {
    const { _id } = (await verifyAccessToken(req.cookies?.accessToken)) as UserProps;

    const cart = await CartModel.find({ userID: _id }).populate({
      path: 'items',
      populate: { path: 'productID' },
    });
    return cart;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
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
