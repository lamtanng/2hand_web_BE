import { Request, Response } from 'express';
import { ProductModel } from '../models/product';
import { ProductDocument } from '../models/product/product.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const products = await ProductModel.find({});
    return { products };
  } catch (error) {
    console.error(error);
  }
};

const addProduct = async (reqBody: ProductDocument, res: Response) => {
  try {
    const product = reqBody;

    const newProduct = await ProductModel.create(product);
    return { newProduct };
  } catch (error) {
    console.error(error);
  }
};

export const productService = { findAll, addProduct };
