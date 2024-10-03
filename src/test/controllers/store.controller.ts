import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';
import { roleService } from '../service/role.service';
import { Request, Response } from 'express';
import { storeService } from '../service/store.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addStore = catchErrors(async (req: Request, res: Response) => {
  const result = await storeService.addStore(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const storeController = {
    findAll,
    addStore
};