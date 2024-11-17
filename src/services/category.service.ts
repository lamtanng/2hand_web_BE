import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CategoryModel } from '../models/category';
import { CategoryDocument } from '../models/category/category.doc';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';
import { categoryFolder } from '../constants/cloudinaryFolder';
import { UploadApiResponse } from 'cloudinary';
import { AddCategoryRequestProps } from '../types/http/category.type';
import { catchServiceFunc } from '../utils/catchErrors';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cates = await CategoryModel.find({}).populate('parentID', 'name');
    return { cates };
  } catch (error) {
    console.error(error);
  }
};

const addCate = catchServiceFunc(async (req: Request, res: Response) => {
  const cate = req.body as AddCategoryRequestProps;
  //upload image to cloudinary
  cate.image && (await uploadCategoryImages({ files: [cate.image] }));
  const newCate = await CategoryModel.create(cate);
  return newCate;
});

const uploadCategoryImages = async ({ files }: Pick<UploadCloudinaryProps, 'files'>) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder: categoryFolder,
    resource_type: 'image',
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url);
};

export const categoryService = { findAll, addCate };
