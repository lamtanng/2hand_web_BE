import { Request, Response } from 'express';
import { ReviewModel } from '../models/review';
import { ReviewDocument } from '../models/review/review.doc';
import { ProductModel } from '../models/product';
import { StatusCodes } from 'http-status-codes';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reviews = await ReviewModel.find().populate("productID", "name");
    return { reviews };
  } catch (error) {
    console.error(error);
  }
};

const addReview = async (reqBody: ReviewDocument, res: Response) => {
  try {
    const review = reqBody;

    const product = await ProductModel.findById(review.productID);
    if (!product) {
      res.status(StatusCodes.NOT_FOUND);
    } else {
      const newReview = await ReviewModel.create(review);
      product.reviewID.push(newReview._id);
      await ProductModel.updateOne({ _id: review.productID }, product, { new: true });
      return { newReview };
    }
  } catch (error) {
    console.error(error);
  }
};

export const reviewService = { findAll, addReview };
