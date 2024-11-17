import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addCate = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.addCate(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateCate = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.updateCate(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneBySlug = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.findOneBySlug(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneById = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.findOneById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const categoryController = {
  findAll,
  addCate,
  updateCate,
  findOneBySlug,
  findOneById,
};
