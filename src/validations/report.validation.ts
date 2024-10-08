import Joi from 'joi';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { ReportProps } from '../types/model/report.type';
import { ReportObjectProps } from '../types/model/reportObject.type';
import { ObjectType } from '../types/enum/objectType.enum';
import { ReplyStatus } from '../types/enum/replyStatus.enum';
import { ObjectIDRegex } from '../constants/validation';

interface ReportSchema extends ReportProps {}
interface ReportObjectSchema extends ReportObjectProps {}

const reportSchema = Joi.object<ReportSchema>({
  object: Joi.object<ReportObjectSchema>({
    type: Joi.string().valid(ObjectType).required(),
    objectID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  }),
  description: Joi.string().default(null),
  replyStatus: Joi.string().valid(ReplyStatus).default(ReplyStatus.Pending),
  replyMessage: Joi.string().default(null),
  senderID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
  reasonID: Joi.string().regex(ObjectIDRegex, 'valid id').required(),
});

export const reportValidation = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // abortEarly: false will return all errors found in the request bod
    await reportSchema.validateAsync(req.body, { abortEarly: false });
    next();
  },
);
