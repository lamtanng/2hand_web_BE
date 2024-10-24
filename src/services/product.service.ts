import { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { AppError } from '../types/error.type';
import { DeleteProductRequestProps, ToggleProductRequestProps } from '../types/http/product.type';
import { ProductProps } from '../types/model/product.type';
import ApiError from '../utils/classes/ApiError';
import { generateSlug } from '../utils/slug';
import { pagination } from '../constants/pagination';

const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, skip } = pagination(req);

    const products = await ProductModel.find({})
      .populate('cateID', 'name')
      .populate('storeID', 'name')
      .limit(limit)
      .skip(skip)
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

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query as unknown as DeleteProductRequestProps;
    return await ProductModel.deleteOne({ _id });
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

const toggleActiveProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.query as unknown as ToggleProductRequestProps;
    const product = await ProductModel.findById(_id);
    if (product) {
      product.isActive = !product.isActive;
      return product.save();
    }
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode }).rejectError();
  }
};

export const productService = {
  findAll,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleActiveProduct,
};
