import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { addressService } from '../services/address.service';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addUser = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.addUser(req.body, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateUserInfo = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.updateUserInfo(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const createReceiveAddress = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.createReceiveAddress(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateAddress = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.updateAddress(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const deleteAddress = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.deleteAddress(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneById = catchErrors(async (req: Request, res: Response) => {
  const result = await userService.findOneById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});
const getProvinces = catchErrors(async (req: Request, res: Response) => {
  const result = await addressService.getProvinces(req, res);
  res.status(StatusCodes.OK).json(result).send();
});
const getDistricts = catchErrors(async (req: Request, res: Response) => {
  const result = await addressService.getDistricts(req, res);
  res.status(StatusCodes.OK).json(result).send();
});
const getWards = catchErrors(async (req: Request, res: Response) => {
  const result = await addressService.getWards(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const userController = {
  findAll,
  addUser,
  updateUserInfo,
  createReceiveAddress,
  updateAddress,
  deleteAddress,
  findOneById,
  getProvinces,
  getDistricts,
  getWards,
};
