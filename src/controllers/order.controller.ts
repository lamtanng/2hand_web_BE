import { StatusCodes } from 'http-status-codes';
import { catchErrors } from '../utils/catchErrors';
import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { CreateCODPaymentRequestProps } from '../types/http/order.type';
import { PaymentMethodModel } from '../models/paymentMethod';
import ApiError from '../utils/classes/ApiError';
import { PaymentMethod } from '../types/enum/paymentMethod.enum';

const findAll = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.findAll(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const findOneById = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.findOneById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const addOrderWithMoMo = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.addOrderWithMoMo(req, res);
  res.status(StatusCodes.OK).json(result).send('<p>some html</p>');
});

const updateOrderStage = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.updateOrderStage(req, res);
  res.status(StatusCodes.OK).json(result).send('<p>some html</p>');
});

const placeOrder = catchErrors(async (req: Request, res: Response) => {
  const { paymentMethodID } = req.body as CreateCODPaymentRequestProps;
  const paymentMethod = await PaymentMethodModel.findOne({ _id: paymentMethodID });
  if (!paymentMethod) {
    throw new ApiError({
      message: 'Payment method not found',
      statusCode: StatusCodes.NOT_FOUND,
    });
  }
  if (paymentMethod.name === PaymentMethod.MOMO) {
    const result = await orderService.payByMomo(req, res);
    res.status(StatusCodes.OK).json(result).send();
  }
  if (paymentMethod.name === PaymentMethod.COD) {
    const result = await orderService.addOrderWithCOD(req, res);
    res.status(StatusCodes.OK).json(result).send();
  }
});

const checkPaymentTransaction = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.checkPaymentTransaction(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const calcShippingFee = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.calcShippingFee(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const getAvailableService = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.getAvailableService(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const getPickupDate = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.getPickupDate(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const calcExpectedDeliveryDate = catchErrors(async (req: Request, res: Response) => {
  const result = await orderService.calcExpectedDeliveryDate(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const orderController = {
  findAll,
  addOrderWithMoMo,
  checkPaymentTransaction,
  updateOrderStage,
  calcShippingFee,
  placeOrder,
  getAvailableService,
  getPickupDate,
  calcExpectedDeliveryDate,
  findOneById,
};
