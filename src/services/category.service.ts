import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { categoryFolder } from '../constants/cloudinaryFolder';
import { CategoryModel } from '../models/category';
import { AddCategoryRequestProps, UpdateCategoryRequestProps } from '../types/http/category.type';
import { catchServiceFunc } from '../utils/catchErrors';
import { generateSlug } from '../utils/slug';
import { uploadCloudinary, UploadCloudinaryProps } from './cloudinary.service';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const cates = await CategoryModel.find({}).populate('parentID');
    return { cates };
  } catch (error) {
    console.error(error);
  }
};

const addCate = catchServiceFunc(async (req: Request, res: Response) => {
  const cate = req.body as AddCategoryRequestProps;
  const image = cate.image ? await uploadCategoryImages({ files: [cate.image] }) : '';
  const newCate = await CategoryModel.create({ ...cate, image });
  return newCate;
});

const updateCate = catchServiceFunc(async (req: Request, res: Response) => {
  const cate = req.body as UpdateCategoryRequestProps;
  const image = cate.image ? await uploadCategoryImages({ files: [cate.image] }) : '';
  const newCate = await CategoryModel.findByIdAndUpdate(
    cate._id,
    { ...cate, image, slug: generateSlug(cate.name) },
    { new: true },
  );
  return newCate;
});

const findOneBySlug = catchServiceFunc(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const cate = await CategoryModel.findOne({ slug }).populate('parentID').populate('childrenIDs');
  return cate;
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const cate = await CategoryModel.findOne({ _id }).populate('parentID').populate('childrenIDs');
  return cate;
});

const uploadCategoryImages = async ({ files }: Pick<UploadCloudinaryProps, 'files'>) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder: categoryFolder,
    resource_type: 'image',
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url)[0];
};

export const categoryService = { findAll, addCate, updateCate, findOneBySlug, findOneById };
