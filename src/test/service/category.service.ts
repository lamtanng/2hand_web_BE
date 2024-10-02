import { MongoClient } from 'mongodb';
import { ROLE_COLLECTION_NAME, RoleDocument } from '../models/role/role.schema';
import { Request, Response } from 'express';
import { env } from '../../config/environment';
import { RoleModel } from '../models/role/role.model';
import { CategoryModel } from '../models/category/category.model';
import { CategoryDocument } from '../models/category/category.schema';
import { CategoryProps } from '../types/category.type';
import { StatusCodes } from 'http-status-codes';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cates = await CategoryModel.find({ parentID: null }).populate({
      path: 'childrenID',
      populate: { path: 'childrenID' },
    });
    return { cates };
  } catch (error) {
    console.error(error);
  }
};

const addCate = async (reqBody: CategoryDocument, res: Response) => {
  try {
    const cate = reqBody;
    const newCate = await CategoryModel.create(cate);
    console.log(cate._id);
    if (cate.parentID) {
      const parentCate = await CategoryModel.findById(cate.parentID);
      if (!parentCate) {
        res.status(StatusCodes.NOT_FOUND);
      } else {
        // const child: CategoryProps[] = parentCate?.childrenCate || [];
        parentCate.childrenID.push(newCate._id);
        const result = await CategoryModel.updateOne({ _id: cate.parentID }, parentCate, {
          new: true,
        });
      }
    }

    return { newCate };
  } catch (error) {
    console.error(error);
  }
};

export const categoryService = { findAll, addCate };
