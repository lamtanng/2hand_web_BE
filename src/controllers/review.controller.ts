import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { reviewService } from '../services/review.service';
import { catchErrors } from '../utils/catchErrors';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const createOne = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.createOne(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const reactToReview = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.reactToReview(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findAllByReviewerID = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.findAllByReviewerID(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findAllByProductID = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.findAllByProductID(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const reviewController = {
  findAll,
  createOne,
  reactToReview,
  findAllByReviewerID,
  findAllByProductID,
};
