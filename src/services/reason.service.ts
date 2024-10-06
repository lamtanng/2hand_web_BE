import { Request, Response } from 'express';
import { ReasonModel } from '../models/reason';
import { ReasonDocument } from '../models/reason/reason.doc';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reasons = await ReasonModel.find({});
    return { reasons };
  } catch (error) {
    console.error(error);
  }
};

const addReason = async (reqBody: ReasonDocument, res: Response) => {
  try {
    const reason = reqBody;

    const newReason = await ReasonModel.create(reason);
    return { newReason };
  } catch (error) {
    console.error(error);
  }
};

export const reasonService = { findAll, addReason };
