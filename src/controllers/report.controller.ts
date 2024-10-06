import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await reportService.findAll(req, res);

  res.status(StatusCodes.OK).json(result).send();
});

const addReport = catchErrors(async (req: Request, res: Response) => {
  const result = await reportService.addReport(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const reportController = {
  findAll,
  addReport,
};
