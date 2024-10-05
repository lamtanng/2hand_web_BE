import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addReview = catchErrors(async (req: Request, res: Response) => {
  const result = await reviewService.addReview(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const reviewController = {
  findAll,
  addReview,
};
