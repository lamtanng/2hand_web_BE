import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';
import { AccountModel } from '../../models/account';

const access = catchErrors(async (req: Request, res: Response) => {
  //navigate to service layer to execute the business logic
  //   const result = await loginService.login(req.body, res);

  const userList = await AccountModel.find({ role: { $all: ['user', 'seller'] } }).exec();

  res.status(StatusCodes.OK).json(userList).send();
});

export const dashboardController = {
  access,
};
