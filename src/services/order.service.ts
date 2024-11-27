import axios from 'axios';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
  calcExpectedDeliveryDateAPI,
  calcShippingFeeAPI,
  getAvailableServiceAPI,
  getPickupDateAPI,
} from '../apis/ghn';
import { createMoMoPayment } from '../apis/momo';
import { MOMO } from '../constants/momo';
import { pagination } from '../constants/pagination';
import { OrderModel } from '../models/order';
import { OrderDetailModel } from '../models/orderDetail';
import { OrderStageModel } from '../models/orderStage';
import { AppError } from '../types/error.type';
import { IPNMoMoPaymentRequestProps, MoMoPaymentItemsProps } from '../types/http/momoPayment.type';
import {
  CalcExpectedDeliveryDateRequest,
  CalcShippingFeeResponseProps,
  CreateCODPaymentRequestProps,
} from '../types/http/order.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { getMoMoCreationRequestBody } from '../utils/momo';
import { deleteEmptyObjectFields } from '../utils/object';
import { ProductModel } from '../models/product';
import { GetAvailableServiceRequestProps } from '../types/http/ghn.type';
import { orderStageService } from './orderStage.service';
import { OrderStage } from '../types/enum/orderStage.enum';
import mongoose from 'mongoose';
import { OrderProps } from '../types/model/order.type';
import { OrderStageProps } from '../types/model/orderStage.type';
import { getDate } from '../utils/format';
const crypto = require('crypto');

const findAll = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID, orderStageID, paymentMethodID, storeID, _id } = req.query;
  const { page, limit, search, skip } = pagination(req);

  let queryObj: { [key: string]: string | undefined } = {
    _id: (_id || '') as string,
    userID: (userID || '') as string,
    orderStageID: (orderStageID || '') as string,
    paymentMethodID: (paymentMethodID || '') as string,
    storeID: (storeID || '') as string,
  };
  deleteEmptyObjectFields(queryObj);

  const orders = await OrderModel.find(queryObj)
    .populate({ path: 'orderDetailIDs', populate: { path: 'productID' } })
    .populate('userID')
    .populate('paymentMethodID')
    .populate('storeID')
    .populate({
      path: 'orderStageID',
      populate: { path: 'orderStageStatusID', populate: { path: 'orderRequestID' } },
    });
  // .limit(limit)
  // .skip(skip)
  // .find({ name: { $regex: search, $options: 'i' } });

  return orders;
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const order = await OrderModel.findById(_id)
    .populate({ path: 'orderDetailIDs', populate: { path: 'productID' } })
    .populate('userID')
    .populate('paymentMethodID')
    .populate('storeID')
    .populate('receiverAddress')
    .populate({
      path: 'orderStageID',
      populate: { path: 'orderStageStatusID', populate: { path: 'orderRequestID' } },
    });
  return order;
});

// const flattenOneOrder = async (orderID: mongoose.Types.ObjectId) => {
//   try {
//     const order = await findOne(orderID);
//     if (!order) {
//       throw new Error('Order not found');
//     }

//     const { orderStageID } = order;
//     const { orderStageStatusID } = orderStageID;

//     const resOrder = { ...order, orderStageID: order.orderStageID?._id };
//     const resOrderStage = { ...orderStageID, orderStageStatusID: orderStageID._id };
//     const resOrderStageStatus = { ...orderStageStatusID, orderRequestID: orderStageStatusID._id };

//     return { order: resOrder, orderStage: resOrderStage };
//   } catch (error: any) {}
// };

const findOne = async (orderID: mongoose.Types.ObjectId) => {
  // interface FindOrderResultProps extends Omit<OrderProps, 'orderStageID'> {
  //   orderStageID: Omit<OrderStageProps, 'orderStageStatusID'> extends {
  //     orderStageStatusID: mongoose.Types.ObjectId;
  //   }
  // }
  return await OrderModel.findById(orderID)
    .populate({ path: 'orderDetailIDs', populate: { path: 'productID' } })
    .populate('userID')
    .populate('paymentMethodID')
    .populate('storeID')
    .populate('receiverAddress')
    .populate({
      path: 'orderStageID',
      populate: { path: 'orderStageStatusID', populate: { path: 'orderRequestID' } },
    });
};

const updateOrderStage = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id, orderStageID } = req.body;
  const order = await OrderModel.findByIdAndUpdate(_id, { orderStageID }, { new: true }).populate(
    'orderStageID',
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
  const session = await OrderModel.startSession();
  session.startTransaction();

  try {
    for (const order of orders) {
      //create order detail
      const { total, storeID, note, items, shipmentCost } = order;

      //create order
      const orderModel = new OrderModel({
        total,
        userID,
        paymentMethodID,
        storeID,
        shipmentCost,
        note,
        // orderDetailIDs,
        receiverAddress,
      });
      const newOrder = await orderModel.save({ session });

      const orderDetailList = items.map((item: MoMoPaymentItemsProps) => {
        const { quantity, totalPrice, id } = item;
        return {
          quantity,
          priceTotal: totalPrice,
          productID: id,
          orderID: newOrder._id,
        };
      });
      const orderDetailIDs = (await OrderDetailModel.insertMany(orderDetailList, { session })).map(
        (item) => item._id,
      );

      const updatedProducts = await ProductModel.bulkWrite(
        orderDetailList.map((order) => ({
          updateOne: {
            filter: { _id: order.productID },
            update: {
              $inc: { quantity: -order.quantity },
            },
          },
        })),
      );

      //update orderDetailIDs to order
      newOrder.orderDetailIDs = orderDetailIDs;

      //create orderStage
      const orderStage = await orderStageService.createOne({
        name: OrderStage.Confirmating,
        orderID: newOrder._id,
        expectedDate: getDate({ addedDate: 2 }),
      });

      //update orderID to order stage
      newOrder.orderStageID = orderStage?._id as mongoose.Types.ObjectId;
      await orderModel.save({ session });
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

const getPickupDate = catchServiceFunc(async (req: Request, res: Response) => {
  const service = await getPickupDateAPI();
  return service.data;
});

const calcExpectedDeliveryDate = catchServiceFunc(async (req: Request, res: Response) => {
  const data = req.body as CalcExpectedDeliveryDateRequest;
  const service = await calcExpectedDeliveryDateAPI(data);
  return service.data;
});

export const orderService = {
  findAll,
  addOrderWithMoMo,
  payByMomo,
  checkPaymentTransaction,
  updateOrderStage,
  calcShippingFee,
  addOrderWithCOD,
  getAvailableService,
  getPickupDate,
  calcExpectedDeliveryDate,
  findOneById,
};
