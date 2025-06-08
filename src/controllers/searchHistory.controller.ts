import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { searchHistoryService } from '../services/searchHistory.service';
import { catchErrors } from '../utils/catchErrors';

const findAllByUserId = catchErrors(async (req: Request, res: Response) => {
  const result = await searchHistoryService.findAllByUserId(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findBySearchText = catchErrors(async (req: Request, res: Response) => {
  const result = await searchHistoryService.findBySearchText(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const getTrendingRecommendations = catchErrors(async (req: Request, res: Response) => {
  const result = await searchHistoryService.getTrendingRecommendations(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const initData = catchErrors(async (req: Request, res: Response) => {
  const result = await searchHistoryService.initData(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const create = catchErrors(async (req: Request, res: Response) => {
  const result = await searchHistoryService.create(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const searchHistoryController = {
  findAllByUserId,
  findBySearchText,
  getTrendingRecommendations,
  initData,
  create,
};
