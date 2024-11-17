import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryModel } from '../models/category';
import { CategoryDocument } from '../models/category/category.doc';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
import { categoryFolder } from '../constants/cloudinaryFolder';
import { UploadApiResponse } from 'cloudinary';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cates = await CategoryModel.find({}).populate('parentID', 'name');
    return { cates };
  } catch (error) {
    console.error(error);
  }
};

const addCate = async (reqBody: CategoryDocument, res: Response) => {
  try {
    const cate = reqBody;
    //upload image to cloudinary
    // const urlImages = await uploadCategoryImages({ files: product.image });
    const newCate = await CategoryModel.create(cate);
    return { newCate };
  } catch (error) {
    console.error(error);
  }
};

const uploadCategoryImages = async ({ files }: Pick<UploadCloudinaryProps, 'files'>) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder: categoryFolder,
    resource_type: 'image',
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url);
};

export const categoryService = { findAll, addCate };
