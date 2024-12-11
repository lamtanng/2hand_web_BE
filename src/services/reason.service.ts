import { Request, Response } from 'express';
import { ReasonModel } from '../models/reason';
import { ReasonDocument } from '../models/reason/reason.doc';
import { CreateReasonRequest, UpdateReasonRequest } from '../types/http/reason.type';
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';
import { catchServiceFunc } from '../utils/catchErrors';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';

const findAll = async (req: Request, res: Response) => {
  try {
    const role = parseJson(req.query.role as string);

    const findCondition = {
      role: role && { $in: role },
    };
    deleteEmptyObjectFields(findCondition);

    const reasons = await ReasonModel.find(findCondition);
    return { reasons };
  } catch (error) {
    console.error(error);
  }
};

const createReason = catchServiceFunc(async (req: Request, res: Response) => {
  const newReason = await ReasonModel.create(req.body);
  return newReason;
});

const updateReason = catchServiceFunc(async (req: Request, res: Response) => {
  const updateReason = req.body as UpdateReasonRequest;
  const newReason = await ReasonModel.findByIdAndUpdate(
    updateReason._id,
    { ...updateReason },
    { new: true },
  );
  return newReason;
});

export const reasonService = { findAll, createReason, updateReason };
