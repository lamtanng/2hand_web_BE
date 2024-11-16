import axios from 'axios';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { calcShippingFeeAPI, getAvailableServiceAPI } from '../apis/ghn';
import { createMoMoPayment } from '../apis/momo';
import { MOMO } from '../constants/momo';
import { pagination } from '../constants/pagination';
import { OrderModel } from '../models/order';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderStatusModel } from '../models/orderStatus';
import { AppError } from '../types/error.type';
import { IPNMoMoPaymentRequestProps, MoMoPaymentItemsProps } from '../types/http/momoPayment.type';
import {
  CalcShippingFeeResponseProps,
  CreateCODPaymentRequestProps,
} from '../types/http/order.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { getMoMoCreationRequestBody } from '../utils/momo';
import { deleteEmptyObjectFields } from '../utils/object';
import { ProductModel } from '../models/product';
import { GetAvailableServiceRequestProps } from '../types/http/ghn.type';
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

const addOrderWithMoMo = catchServiceFunc(async (req: Request, res: Response) => {
  const { extraData } = req.body as IPNMoMoPaymentRequestProps;
  const data = JSON.parse(extraData) as CreateCODPaymentRequestProps;
  return createOrder(data);
});

const addOrderWithCOD = catchServiceFunc(async (req: Request, res: Response) => {
  const data = req.body as CreateCODPaymentRequestProps;
  return createOrder(data);
});

const payByMomo = catchServiceFunc(async (req: Request, res: Response) => {
  const { orders, total: amount } = req.body as CreateCODPaymentRequestProps;
  const extraData = JSON.stringify(req.body);
  const items = orders.reduce((accumulator: MoMoPaymentItemsProps[], shopOrder: any) => {
    return accumulator.concat(shopOrder.items);
  }, []);
  const requestBody = getMoMoCreationRequestBody({ items, amount, extraData });

  const data = await createMoMoPayment(requestBody);
  return data;
});

const createOrder = async (data: CreateCODPaymentRequestProps) => {
  const { userID, paymentMethodID, orders, receiverAddress } = data as CreateCODPaymentRequestProps;
  const orderStatus = await OrderStatusModel.findOne({ stage: 1 });

  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    for (const order of orders) {
      //create order detail
      const { total, storeID, note, items, shipmentCost } = order;
      const orderDetailList = items.map((item: MoMoPaymentItemsProps) => {
        const { quantity, totalPrice, id } = item;
        return {
          quantity,
          priceTotal: totalPrice,
          productID: id,
        };
      });
      const orderDetailIDs = (await OrderDetailModel.insertMany(orderDetailList, { session })).map(
        (item) => item._id,
      );
      const updatedProducts = await ProductModel.updateMany(
        { _id: { $in: orderDetailList.map((item) => item.productID) } },
        {
          $inc: { quantity: { $multiply: -1, $in: orderDetailList.map((item) => item.quantity) } },
        },
      );
      console.log(updatedProducts);
      // orderDetailList.map(async (order) => {
      //   console.log(order.quantity);

      //   const updatedProduct = await ProductModel.findByIdAndUpdate(order.productID, {
      //     quantity: { $inc: -1 as number },
      //   });
      //   if (!updatedProduct) {
      //     throw new ApiError({
      //       message: 'Order detail created failed',
      //       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      //     });
      //   }
      //   return updatedProduct;
      // });

      if (!orderDetailIDs) {
        throw new ApiError({
          message: 'Order detail created failed',
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      //create order
      const orderModel = new OrderModel({
        total,
        userID,
        orderStatusID: orderStatus?._id,
        paymentMethodID,
        storeID,
        shipmentCost,
        note,
        orderDetailIDs,
        receiverAddress,
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
    return { message: ReasonPhrases.OK };
  } catch (error: AppError) {
    await session.abortTransaction();
    throw new ApiError({
      message: error.message,
      statusCode: error.statusCode,
    });
  } finally {
    session.endSession();
  }
};

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

const calcShippingFee = catchServiceFunc(async (req: Request, res: Response) => {
  const fee = await calcShippingFeeAPI(req.body);
  return fee.data;
});

const getAvailableService = catchServiceFunc(async (req: Request, res: Response) => {
  const service = await getAvailableServiceAPI(req.body as GetAvailableServiceRequestProps);
  return service.data;
});

export const orderService = {
  findAll,
  addOrderWithMoMo,
  payByMomo,
  checkPaymentTransaction,
  updateOrderStatus,
  calcShippingFee,
  addOrderWithCOD,
  getAvailableService
};
