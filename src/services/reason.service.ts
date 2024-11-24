import { Request, Response } from 'express';
import { ReasonModel } from '../models/reason';
import { ReasonDocument } from '../models/reason/reason.doc';
import { catchServiceFunc } from '../utils/catchErrors';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reasons = await ReasonModel.find({});
    return { reasons };
  } catch (error) {
    console.error(error);
  }
};

const addReason = catchServiceFunc(async (req: Request, res: Response) => {
  const reason = req.body;
  const newReason = await ReasonModel.create(reason);
  return newReason;
});

export const reasonService = { findAll, addReason };
