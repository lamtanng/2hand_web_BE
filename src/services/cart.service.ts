import { Request, Response } from 'express';
import { CartModel } from '../models/cart';
import { AppError } from '../types/error.type';
import { RemoveCartItemRequestProps } from '../types/http/cart.type';
import { CartProps } from '../types/model/cart.type';
import { UserProps } from '../types/model/user.type';
import ApiError from '../utils/classes/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { CartItemProps } from '../types/model/cartItem.type';
import _ from 'lodash';
import { ProductProps } from '../types/model/product.type';

const findAll = async (req: Request, res: Response) => {
  try {
    const { _id } = (await verifyAccessToken(req.cookies?.accessToken)) as UserProps;

    const cart = await CartModel.findOne({ userID: _id })
      .populate({
        path: 'items',
        populate: { path: 'productID', populate: 'storeID' },
      })
      .lean();

    //group products by store with key is storeID
    const group = _.groupBy(cart?.items, (product: any) => product.productID.storeID._id);
    const formattedResult = _.map(group, (products) => {
      const store = products[0].productID as unknown as ProductProps;
      return {
        store: store.storeID,
        products,
      };
    });

    return formattedResult;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const findOneItem = async (req: Request, res: Response) => {
  try {
    const { _id } = (await verifyAccessToken(req.cookies?.accessToken)) as UserProps;
    const { productID } = req.params;
    const cart = await CartModel.findOne(
      {
        userID: _id,
      },
      {
        items: {
          $elemMatch: {
            productID,
          },
        },
      },
    );

    return cart?.items[0];
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const addCartItem = async (req: Request, res: Response) => {
  try {
    const {
      userID,
      items: [{ productID, quantity }],
    } = req.body as CartProps;

    const cart = await CartModel.findOne({ userID });
    if (!cart) return await CartModel.create(req.body);

    const existingProduct = cart.items.find((item) => String(item.productID) === String(productID));
    existingProduct
      ? (existingProduct.quantity = Number(quantity))
      : cart.items.push({ productID, quantity });

    return await cart.save();
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { userID, productID } = req.body as RemoveCartItemRequestProps;

    const isDeleted = await CartModel.findOneAndUpdate(
      { userID },
      { $pull: { items: { productID: productID } } },
      { new: true },
    );

    return { isDeleted };
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const cartService = { findAll, addCartItem, removeCartItem, findOneItem };
