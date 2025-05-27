import { Request, Response } from 'express';
import { ReviewModel } from '../models/review';
import { uploadCloudinary, UploadCloudinaryProps } from '../services/cloudinary.service';
import { catchServiceFunc } from '../utils/catchErrors';
import { UploadApiResponse } from 'cloudinary';
import { reviewFolder } from '../constants/cloudinaryFolder';
import { CreateReviewRequest, ReactToReviewRequest } from '../types/http/review.type';
import { OrderDetailModel } from '../models/orderDetail';
import { openaiService } from './openai.service';
import { PromptType } from '../types/http/openai.type';

const findAll = catchServiceFunc(async (reqBody: Request, res: Response) => {
  const reviews = await ReviewModel.find().findAll();
  return reviews;
});

const createOne = catchServiceFunc(async (req: Request, res: Response) => {
  const { video, image, orderDetailID, content } = req.body as CreateReviewRequest;

  let request: any[] = [];
  if (image?.length) {
    image.forEach((img) => {
      if (img)
        request.push({
          type: 'image_url',
          image_url: {
            url: img,
          },
        });
    });
  }
  console.log('request image', request);

  if (content) {
    request.push({
      type: 'text',
      text: content,
    });
  }
  console.log('request content', request);

  const result = await openaiService.askWithAI(request, PromptType.CheckCommunityViolation);
  // console.log('result', result);
  return {
    content: request,
    result: JSON.parse(result?.[0] || '{}'),
  };

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

  await OrderDetailModel.findByIdAndUpdate(orderDetailID, { reviewID: review._id });

  return review;
});

const reactToReview = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, likes, replyMessage } = req.body as ReactToReviewRequest;
  const review = await ReviewModel.findByIdAndUpdate(_id, { likes, replyMessage }, { new: true });

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

const findAllByReviewerID = catchServiceFunc(async (req: Request, res: Response) => {
  const { reviewerID } = req.params;
  const reviews = await ReviewModel.find({ reviewerID }).findAll();

  return reviews;
});

const findAllByProductID = catchServiceFunc(async (req: Request, res: Response) => {
  const { productID } = req.params;
  const reviews = await ReviewModel.find({ productID }).findAll();

  return reviews;
});

export const reviewService = {
  findAll,
  createOne,
  reactToReview,
  findAllByReviewerID,
  findAllByProductID,
};
