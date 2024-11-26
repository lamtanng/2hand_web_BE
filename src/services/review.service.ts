import { Request, Response } from 'express';
import { ReviewModel } from '../models/review';
import { uploadCloudinary, UploadCloudinaryProps } from '../services/cloudinary.service';
import { catchServiceFunc } from '../utils/catchErrors';
import { UploadApiResponse } from 'cloudinary';
import { reviewFolder } from '../constants/cloudinaryFolder';
import { CreateReviewRequest } from '../types/http/review.type';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reviews = await ReviewModel.find().populate('productID', 'name');
    return { reviews };
  } catch (error) {
    console.error(error);
  }
};

const createOne = catchServiceFunc(async (req: Request, res: Response) => {
  const { video, image } = req.body as CreateReviewRequest;

  const uploadedVideos = await uploadReviewFiles({
    files: video,
    asset_folder: reviewFolder,
    resource_type: 'video',
  });
  const uploadedImages = await uploadReviewFiles({
    files: image,
    asset_folder: reviewFolder,
    resource_type: 'image',
  });

  const review = await ReviewModel.create({
    ...req.body,
    image: uploadedImages,
    video: uploadedVideos,
  });

  return review;
});

const uploadReviewFiles = async ({ files, asset_folder, resource_type }: UploadCloudinaryProps) => {
  const uploadedFiles = await uploadCloudinary({
    files,
    asset_folder,
    resource_type,
  });

  return uploadedFiles.map((file: UploadApiResponse) => file.secure_url);
};

export const reviewService = { findAll, createOne };
