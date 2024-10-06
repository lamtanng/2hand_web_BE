import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../../models/user';
import { catchErrors } from '../../utils/catchErrors';

const access = catchErrors(async (req: Request, res: Response) => {
  //navigate to service layer to execute the business logic
  //   const result = await loginService.login(req.body, res);

  const userList = await UserModel.find({ role: { $all: ['user'] } }).exec();

  res.status(StatusCodes.OK).json(userList).send();
});

export const dashboardController = {
  access,
};
