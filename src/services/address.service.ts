import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { getDistrictAPI, getProvinceAPI, getWardAPI } from '../apis/ghn';
import { GetDistrictRequestProps, GetWardRequestProps } from '../types/http/address.type';

const getProvinces = catchServiceFunc(async (req: Request, res: Response) => {
  const provinces = await getProvinceAPI();
  return provinces;
});

const getDistricts = catchServiceFunc(async (req: Request, res: Response) => {
  const { province_id  } = req.query as GetDistrictRequestProps;

  const districts = await getDistrictAPI({ province_id });
  return districts;
});

const getWards = catchServiceFunc(async (req: Request, res: Response) => {
  const { district_id } = req.query as GetWardRequestProps;
  const wards = await getWardAPI({ district_id });
  return wards;
});

export const addressService = { getProvinces, getDistricts, getWards };
