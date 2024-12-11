import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { storeService } from '../services/store.service';
import { CreateStoreRequestProps } from '../types/http/store.type';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addStore = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.addStore(req, res);
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

const createGHNStore = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.createGHNStore(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const update = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.update(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const statistics = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.statistics(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const storeController = {
  findAll,
  addStore,
  findOneById,
  findOneByUserId,
  createGHNStore,
  update,
  statistics,
};
