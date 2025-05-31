import { openaiService } from '../services/openai.service';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const promptAI = catchErrors(async (req: Request, res: Response) => {
  const result = await openaiService.promptAIService(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const checkViolationRequest = catchErrors(async (req: Request, res: Response) => {
  const result = await openaiService.checkViolationRequest(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const openaiController = { promptAI, checkViolationRequest };
