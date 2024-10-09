import { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { ProductDocument } from '../models/product/product.doc';
import { ProductQuality } from '../types/enum/productQuality.enum';
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';

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

const addProduct = async (reqBody: ProductDocument, res: Response) => {
  try {
    const product = new ProductModel({
      name: 'Product 03',
      description: 'Product 01 description',
      cateID: '66ff5bfd99b8498b6508784d',
      storeID: '67025231c7c0f38968366f2e',
      price: 100000,
      quantity: 1,
      quality: ProductQuality.Average,
    });

    const newProduct = await ProductModel.create(product);
    return { newProduct };
  } catch (error) {
    console.error(error);
  }
};

export const productService = { findAll, addProduct };
