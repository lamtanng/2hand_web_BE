import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';
import { roleService } from '../service/role.service';
import { Request, Response } from 'express';
import { categoryService } from '../service/category.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addCate = catchErrors(async (req: Request, res: Response) => {
  const result = await categoryService.addCate(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const categoryController = {
    findAll,
    addCate
};
