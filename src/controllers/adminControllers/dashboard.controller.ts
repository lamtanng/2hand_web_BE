import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../../utils/catchErrors';

const access = catchErrors(async (req: Request, res: Response) => {
  //navigate to service layer to execute the business logic
  //   const result = await loginService.login(req.body, res);

  res.status(StatusCodes.OK).json({ message: 'Dashboard' }).send();
});

export const dashboardController = {
  access,
};
