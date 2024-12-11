import { Request, Response } from 'express';
import { ReasonModel } from '../models/reason';
import { ReasonDocument } from '../models/reason/reason.doc';
import { CreateReasonRequest } from '../types/http/reason.type';
import { AppError } from '../types/error.type';
import ApiError from '../utils/classes/ApiError';

const findAll = async (reqBody: Request, res: Response) => {
  try {
    const reasons = await ReasonModel.find({});
    return { reasons };
  } catch (error) {
    console.error(error);
  }
};

const createReason = async (reason: CreateReasonRequest) => {
  try {
    const newReason = await ReasonModel.create(reason);
    return newReason;
  } catch (error: AppError) {
    return new ApiError({ message: error.message, statusCode: error.statusCode });
  }
};

export const reasonService = { findAll, createReason };
