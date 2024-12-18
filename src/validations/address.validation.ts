import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import {
  AddressProps,
  DistrictAddressProps,
  GHNAddressProps,
  GHNSupportType,
  ProvincesAddressProps,
  WardAddressProps,
} from '../types/model/address.type';
import { catchErrors } from '../utils/catchErrors';
import { CommonValidation } from './common.validation';
import { AddressRequestProps } from '../types/http/address.type';

interface GHNAddressSchema extends GHNAddressProps {}
interface ProvincesAddressSchema extends ProvincesAddressProps {}
interface DistrictAddressSchema extends DistrictAddressProps {}
interface WardAddressSchema extends WardAddressProps {}
interface AddressSchema extends AddressProps {}

const { idSchema } = CommonValidation;

const GHNAddressSchema = Joi.object<GHNAddressSchema>().keys({
  NameExtension: Joi.array().items(Joi.string()).allow(null, ''),
  CanUpdateCOD: Joi.boolean().allow(null, ''),
  Status: Joi.number().allow(null, ''),
});

const provinceSchema = GHNAddressSchema.append<ProvincesAddressSchema>({
  ProvinceID: Joi.number().required(),
  ProvinceName: Joi.string().required(),
  CountryID: Joi.number().allow(null, ''),
  Code: Joi.number().allow(null, ''),
});

const districtSchema = GHNAddressSchema.append<DistrictAddressSchema>({
  DistrictID: Joi.number().required(),
  ProvinceID: Joi.number().required(),
  DistrictName: Joi.string().required(),
  SupportType: Joi.string()
    .allow(null, '')
    .valid(...Object.values(GHNSupportType)),
});

const wardSchema = GHNAddressSchema.append<WardAddressSchema>({
  WardCode: Joi.string().required(),
  DistrictID: Joi.number().required(),
  WardName: Joi.string().required(),
  SupportType: Joi.string()
    .allow(null, '')
    .valid(...Object.values(GHNSupportType)),
});

const addressSchema = Joi.object<AddressSchema>().keys({
  address: Joi.string(),
  isDefault: Joi.boolean(),
  _id: idSchema,
  province: provinceSchema,
  district: districtSchema,
  ward: wardSchema.required(),
});

export const userAddress = catchErrors(async (req: Request, res: Response, next: NextFunction) => {
  const { _id, address } = req.body as AddressRequestProps;
  await addressSchema.validateAsync(address, { abortEarly: true });
  await idSchema.validateAsync(_id, { abortEarly: true });
  next();
});

export const addressValidation = { addressSchema, userAddress };
