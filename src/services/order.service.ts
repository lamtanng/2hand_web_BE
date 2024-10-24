import axios from 'axios';
import { Request, Response } from 'express';
import { createMoMoPayment } from '../apis/momo';
import { MOMO } from '../constants/momo';
import { OrderModel } from '../models/order';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderStatusModel } from '../models/orderStatus';
import { IPNMoMoPaymentRequestProps, MoMoPaymentItemsProps } from '../types/http/momoPayment.type';
import { catchServiceFunc } from '../utils/catchErrors';
import { getMoMoCreationRequestBody } from '../utils/momo';
const crypto = require('crypto');

const findAll = catchServiceFunc(async (reqBody: Request, res: Response) => {
  const orders = await OrderModel.find({});
  return orders;
});

const findAllByUserID = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID } = req.query;
  const orders = await OrderModel.find({ userID });
  return orders;
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
      const orderModel = new OrderModel({
        total,
        userID,
        orderStatusID: orderStatus?._id,
        paymentMethodID,
        storeID: storeId,
        shipmentCost: 15000,
        note,
      });

      const newOrder = await orderModel.save({ session });
      if (!newOrder) {
        await session.abortTransaction();
        session.endSession();
        return { message: 'Order created failed' };
      }

      const formattedItems = items.map((item: MoMoPaymentItemsProps) => {
        const { quantity, totalPrice, id } = item;
        return {
          quantity,
          priceTotal: totalPrice,
          productID: id,
          orderID: newOrder._id,
        };
      });
      const newItems = await OrderDetailModel.insertMany(formattedItems, { session });
      if (newItems) {
        await session.abortTransaction();
        session.endSession();
        return { message: 'Order created failed' };
      }
    }

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
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
  findAllByUserID,
};
