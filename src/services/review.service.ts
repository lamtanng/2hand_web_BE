import { CreateNotificationRequest } from '../types/http/notification.type';
import { NotificationType } from '../types/model/notification.type';
import { OrderProps } from '../types/model/order.type';
import { ProductProps } from '../types/model/product.type';
// import { NOTIFICATION_CONTENT_SELLER } from '@/utils/notificationHelper';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { reviewFolder } from '../constants/cloudinaryFolder';
import { OrderDetailModel } from '../models/orderDetail';
import { ReviewModel } from '../models/review';
import { uploadCloudinary, UploadCloudinaryProps } from '../services/cloudinary.service';
import { CreateReviewRequest, ReactToReviewRequest } from '../types/http/review.type';
import { catchServiceFunc } from '../utils/catchErrors';
import { notificationService } from './notification.service';
import { NOTIFICATION_CONTENT_SELLER } from '../utils/notificationHelper';

const findAll = catchServiceFunc(async (reqBody: Request, res: Response) => {
  const reviews = await ReviewModel.find().findAll();
  return reviews;
});

const createOne = catchServiceFunc(async (req: Request, res: Response) => {
  const { video, image, orderDetailID } = req.body as CreateReviewRequest;

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

  const updatedOrderDetail = await OrderDetailModel.findByIdAndUpdate(orderDetailID, {
    reviewID: review._id,
  })
    .populate('orderID')
    .populate('productID');

  if (updatedOrderDetail && updatedOrderDetail?.orderID && updatedOrderDetail?.productID) {
    const order = updatedOrderDetail.orderID as unknown as OrderProps;
    const product = updatedOrderDetail.productID as unknown as ProductProps;

    const noti: CreateNotificationRequest = {
      receiver: order.storeID,
      title: NOTIFICATION_CONTENT_SELLER[NotificationType.Review].new_review.title,
      content: NOTIFICATION_CONTENT_SELLER[NotificationType.Review].new_review.content(
        product.name,
      ),
      type: NotificationType.Review,
      relatedId: review._id,
    };
    await notificationService.sendNotification([noti]);
  }

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
