import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../../models/user';
import { catchErrors } from '../../utils/catchErrors';
import { adminService } from '../../services/admin.service';

const statistics = catchErrors(async (req: Request, res: Response) => {
  const results = await adminService.statistics(req, res);
  res.status(StatusCodes.OK).json(results).send();
});

export const dashboardController = {
  statistics,
};
