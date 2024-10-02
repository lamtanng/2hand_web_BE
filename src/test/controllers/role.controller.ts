import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';
import { roleService } from '../service/role.service';
import { Request, Response } from 'express';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await roleService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addRole = catchErrors(async (req: Request, res: Response) => {
  const result = await roleService.addRole(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const roleController = {
    findAll,
    addRole
};
