import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryModel } from '../models/category';
import { CategoryDocument } from '../models/category/category.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cates = await CategoryModel.find({}).populate("parentID", "name");
    return { cates };
  } catch (error) {
    console.error(error);
  }
};

const addCate = async (reqBody: CategoryDocument, res: Response) => {
  try {
    const cate = reqBody;
    const newCate = await CategoryModel.create(cate);
    return { newCate };
  } catch (error) {
    console.error(error);
  }
};

export const categoryService = { findAll, addCate };
