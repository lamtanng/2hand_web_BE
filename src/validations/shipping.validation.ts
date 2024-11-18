import Joi from 'joi';
import { CalcShippingFeeRequestProps } from '../types/http/order.type';
import { catchErrors } from '../utils/catchErrors';
import { NextFunction, Request, Response } from 'express';
import { CalcShippingFeeItemProps, GetAvailableServiceRequestProps } from '../types/http/ghn.type';

interface CalcShippingFeeSchema extends CalcShippingFeeRequestProps {}
interface GetAvailableServiceSchema extends GetAvailableServiceRequestProps {}

const calcShippingFeeSchema = Joi.object<CalcShippingFeeSchema>({
  shopid: Joi.number().required(),
  weight: Joi.number().required().max(1600000).min(0).default(0),
  service_type_id: Joi.number().required(),
  from_district_id: Joi.number().required(),
  from_ward_code: Joi.string().required(),
  to_district_id: Joi.number().required(),
  to_ward_code: Joi.number().allow(null, ''),
  insurance_value: Joi.number().allow(null, ''),
  height: Joi.number().allow(null, '').max(200).min(0).default(0),
  length: Joi.number().allow(null, '').max(200).min(0).default(0),
  width: Joi.number().allow(null, '').max(200).min(0).default(0),
  cod_value: Joi.number().allow(null, '').max(10000000).min(0).default(0),
  items: Joi.array<CalcShippingFeeItemProps>()
    .items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().required(),
        height: Joi.number().required(),
        weight: Joi.number().required(),
        length: Joi.number().required(),
        width: Joi.number().required(),
      }),
    )
    .allow(null, ''),
});

const getAvailableServiceSchema = Joi.object<GetAvailableServiceSchema>({
  shop_id: Joi.number().required(),
  from_district: Joi.number().required(),
  to_district: Joi.number().required(),
});

const calcShippingFee = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await calcShippingFeeSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

const getAvailableService = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  await getAvailableServiceSchema.validateAsync(req.body, { abortEarly: false });
  next();
});

export const shippingValidation = { calcShippingFee, getAvailableService };
