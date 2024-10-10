import { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { AppError } from '../types/error.type';
import { ProductProps } from '../types/model/product.type';
import ApiError from '../utils/classes/ApiError';
import { generateSlug } from '../utils/slug';

const findAll = async (req: Request, res: Response) => {
  try {
    const page = (req.query.page || 1) as number;
    const limit = (req.query.limit || 10) as number;
    const search = req.query.search || '';

    const products = await ProductModel.find({})
      .populate('cateID', 'name')
      .populate('storeID', 'name')
      .limit(limit)
      .skip((page - 1) * limit)
      .find({ name: { $regex: search, $options: 'i' } });

    const total = await ProductModel.countDocuments({ name: { $regex: search, $options: 'i' } });
    const response = {
      page,
      limit,
      total,
      products,
    };
    return { response };
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body as ProductProps;
    return await ProductModel.create(product);
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body as ProductProps;

    //check conditions

    return await ProductModel.findByIdAndUpdate(
      product._id,
      { ...product, slug: generateSlug(product.name) },
      {
        new: true,
      },
    );
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const productService = { findAll, addProduct, updateProduct };
