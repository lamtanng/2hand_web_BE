import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { roleService } from '../services/role.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await roleService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addRole = catchErrors(async (req: Request, res: Response) => {
  const result = await roleService.addRole(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateRole = catchErrors(async (req: Request, res: Response) => {
  const result = await roleService.updateRole(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const roleController = {
  findAll,
  addRole,
  updateRole,
};
