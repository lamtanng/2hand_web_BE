import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';
import { Request, Response } from 'express';
import { userService } from '../service/user.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

// const findOne = catchErrors(async (req: Request, res: Response) => {
//   const result = await userService.findOne(req, res);

//   res.status(StatusCodes.OK).json(result).send();
// });

const addUser = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.addUser(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const userController = {
    findAll,
    addUser,
    // findOne
};
