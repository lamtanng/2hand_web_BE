import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { storeService } from '../services/store.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addStore = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.addStore(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneById = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.findOneById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneByUserId = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.findOneByUserId(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const storeController = {
  findAll,
  addStore,
  findOneById,
  findOneByUserId
};
