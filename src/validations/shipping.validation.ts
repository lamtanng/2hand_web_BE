import Joi from 'joi';
import { CalcShippingFeeRequestProps } from '../types/http/order.type';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';

interface CalcShippingFeeSchema extends CalcShippingFeeRequestProps {}

const calcShippingFeeSchema = Joi.object<CalcShippingFeeSchema>({
  shopid: Joi.number().required(),
  weight: Joi.number().required(),
  service_type_id: Joi.number().required(),
  from_district_id: Joi.number().required(),
  from_ward_code: Joi.string().required(),
  to_district_id: Joi.number().required(),
  to_ward_code: Joi.number().allow(null, ''),
});

const calcShippingFee = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await calcShippingFeeSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const shippingValidation = { calcShippingFee };
