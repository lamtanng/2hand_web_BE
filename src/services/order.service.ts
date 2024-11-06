import axios from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createMoMoPayment } from '../apis/momo';
import { MOMO } from '../constants/momo';
import { pagination } from '../constants/pagination';
import { OrderModel } from '../models/order';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderStatusModel } from '../models/orderStatus';
import { AppError } from '../types/error.type';
import { IPNMoMoPaymentRequestProps, MoMoPaymentItemsProps } from '../types/http/momoPayment.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { getMoMoCreationRequestBody } from '../utils/momo';
import { deleteEmptyObjectFields } from '../utils/object';
const crypto = require('crypto');

const findAll = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID, orderStatusID, paymentMethodID, storeID, _id } = req.query;
  const { page, limit, search, skip } = pagination(req);

  let queryObj: { [key: string]: string | undefined } = {
    _id: (_id || '') as string,
    userID: (userID || '') as string,
    orderStatusID: (orderStatusID || '') as string,
    paymentMethodID: (paymentMethodID || '') as string,
    storeID: (storeID || '') as string,
  };
  deleteEmptyObjectFields(queryObj);

  const orders = await OrderModel.find(queryObj)
    .populate({ path: 'orderDetailIDs', populate: { path: 'productID' } })
    .populate('userID')
    .populate('orderStatusID')
    .populate('paymentMethodID')
    .populate('storeID');
  // .limit(limit)
  // .skip(skip)
  // .find({ name: { $regex: search, $options: 'i' } });

  return orders;
});

const updateOrderStatus = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, orderStatusID } = req.body;
  const order = await OrderModel.findByIdAndUpdate(_id, { orderStatusID }, { new: true }).populate(
    'orderStatusID',
  );
  return order;
});

const addOrder = catchServiceFunc(async (req: Request, res: Response) => {
  const { extraData } = req.body as IPNMoMoPaymentRequestProps;
  const { userID, paymentMethodID, orders } = JSON.parse(extraData);
  const orderStatus = await OrderStatusModel.findOne({ stage: 1 });

  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    for (const order of orders) {
      const { total, storeId, note, items } = order;
      const formattedItems = items.map((item: MoMoPaymentItemsProps) => {
        const { quantity, totalPrice, id } = item;
        return {
          quantity,
          priceTotal: totalPrice,
          productID: id,
        };
      });
      const orderDetailIDs = (await OrderDetailModel.insertMany(formattedItems, { session })).map(
        (item) => item._id,
      );

      if (!orderDetailIDs) {
        throw new ApiError({
          message: 'Order detail created failed',
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      const orderModel = new OrderModel({
        total,
        userID,
        orderStatusID: orderStatus?._id,
        paymentMethodID,
        storeID: storeId,
        shipmentCost: 15000,
        note,
        orderDetailIDs,
      });

      const newOrder = await orderModel.save({ session });
      if (!newOrder) {
        throw new ApiError({
          message: 'Order detail created failed',
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }
    }

    await session.commitTransaction();
    return true;
  } catch (error: AppError) {
    await session.abortTransaction();
    throw new ApiError({
      message: error.message,
      statusCode: error.statusCode,
    });
  } finally {
    session.endSession();
  }
});

const payByMomo = catchServiceFunc(async (req: Request, res: Response) => {
  const { orders, total: amount } = req.body;
  const extraData = JSON.stringify(req.body);
  const items = orders.reduce((accumulator: MoMoPaymentItemsProps[], shopOrder: any) => {
    return accumulator.concat(shopOrder.items);
  }, []);
  const requestBody = getMoMoCreationRequestBody({ items, amount, extraData });

  const data = await createMoMoPayment(requestBody);
  return data;
});

const checkPaymentTransaction = async (req: Request, res: Response) => {
  const { orderId, requestId } = req.body;
  const { accessKey, secretKey, partnerCode, lang } = MOMO;

  const rawSignature =
    'accessKey=' +
    accessKey +
    '&orderId=' +
    orderId +
    '&partnerCode=' +
    partnerCode +
    '&requestId=' +
    requestId;

  //signature
  var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const requestBody = JSON.stringify({
    partnerCode,
    orderId,
    requestId,
    signature,
    lang,
  });

  //Send the request and get the response
  const result = await axios.post(
    'https://test-payment.momo.vn/v2/gateway/api/query',
    JSON.parse(requestBody),
    {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return result.data;
};

export const orderService = {
  findAll,
  addOrder,
  payByMomo,
  checkPaymentTransaction,
  updateOrderStatus,
};
