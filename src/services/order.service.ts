import axios from 'axios';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
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
import { ProductModel } from '../models/product';
import { OrderStage } from '../types/enum/orderStage.enum';
import { AppError } from '../types/error.type';
import { GetAvailableServiceRequestProps } from '../types/http/ghn.type';
import { IPNMoMoPaymentRequestProps, MoMoPaymentItemsProps } from '../types/http/momoPayment.type';
import {
  CalcExpectedDeliveryDateRequest,
  CreateCODPaymentRequestProps,
  CreatedOrderProps,
} from '../types/http/order.type';
import { PaginationResponseProps } from '../types/http/pagination.type';
import { catchServiceFunc } from '../utils/catchErrors';
import ApiError from '../utils/classes/ApiError';
import { getDate } from '../utils/format';
import { getMoMoCreationRequestBody } from '../utils/momo';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import { orderStageService } from './orderStage.service';
import { OrderStageStatusModel } from '../models/orderStageStatus';
import { ORDERREQUEST_COLLECTION_NAME } from '../models/orderRequest/orderRequest.doc';
import { HttpMessage } from '../constants/httpMessage';
const crypto = require('crypto');

const findAll = catchServiceFunc(async (req: Request, res: Response) => {
  const { userID, stages, paymentMethodID, storeID, _id } = req.query;
  const { page, limit, search, skip } = pagination(req);

  const sort = parseJson(req.query.sort as string);

  let queryObj = {
    _id: (_id || '') as string,
    userID: (userID || '') as string,
    paymentMethodID: (paymentMethodID || '') as string,
    storeID: (storeID || '') as string,
    name: search && { $regex: search, $options: 'i' },
    orderStageID: stages && {
      $in: await OrderStageModel.find({
        name: { $in: parseJson(stages as string) },
      }),
    },
  };

  deleteEmptyObjectFields(queryObj);
  const orders = await OrderModel.find({
    ...queryObj,
  })
    .populate({
      path: 'orderDetailIDs',
      populate: ['productID', 'reviewID'],
    })
    .populate('userID')
    .populate('paymentMethodID')
    .populate({ path: 'storeID', populate: 'userID' })
    .populate({
      path: 'orderStageID',
      populate: {
        path: 'orderStageStatusID',
        populate: { path: 'orderRequestID', populate: 'reasonID' },
      },
    })
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const total = await OrderModel.countDocuments(queryObj);
  return { page, limit, total, data: orders } as PaginationResponseProps;
});

const findOneById = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.params;
  const order = await OrderModel.findById(_id)
    .populate({
      path: 'orderDetailIDs',
      populate: ['productID', 'reviewID'],
    })
    .populate('userID')
    .populate('paymentMethodID')
    .populate({ path: 'storeID', populate: 'userID' })
    .populate('receiverAddress')
    .populate({
      path: 'orderStageID',
      populate: {
        path: 'orderStageStatusID',
        populate: { path: 'orderRequestID', populate: 'reasonID' },
      },
    });
  return order;
});

const tracking = catchServiceFunc(async (req: Request, res: Response) => {
  const order = (await findOne(req.params.orderID)) as unknown as any;

  const { orderStageID } = order;

  const stages = await OrderStageModel.find({ orderID: order._id })
    .sort({ createdAt: 1 })
    .populate('orderStageStatusID');

  const statuses = await OrderStageStatusModel.aggregate([
    {
      $match: {
        orderStageID: { $in: stages.map((stage) => stage._id) }, // Filter by orderStageIDs
      },
    },
    {
      $lookup: {
        from: 'requests', // Replace with your request collection name
        localField: 'orderRequestID', // Reference field in OrderStageStatusModel
        foreignField: '_id', // Matching field in request collection
        as: 'request', // Alias for joined request documents
      },
    },
    {
      $unwind: '$request', // Deconstruct the request array (optional)
    },
    {
      $project: {
        _id: 1,
        orderStatus: {
          $map: {
            input: { $concatArrays: ['$status', '$request'] }, // Combine data
            as: 'combined',
            in: {
              status: '$$combined.0', // Project status from combined array
              request: '$$combined.1', // Project request from combined array
            },
          },
        },
      },
    },
  ]);

  // {
  //   $unwind: '$request', // Deconstruct the request array (optional)
  // },
  const { orderStageStatusID } = orderStageID;

  // const resOrder = { ...order, orderStageID: order.orderStageID?._id };
  // const resOrderStage = { ...orderStageID, orderStageStatusID: orderStageID._id };
  // const resOrderStageStatus = { ...orderStageStatusID, orderRequestID: orderStageStatusID._id };

  return { statuses };
});

const findOne = async (orderID: mongoose.Types.ObjectId | string) => {
  // interface FindOrderResultProps extends Omit<OrderProps, 'orderStageID'> {
  //   orderStageID: Omit<OrderStageProps, 'orderStageStatusID'> extends {
  //     orderStageStatusID: mongoose.Types.ObjectId;
  //   }
  // }
  return await OrderModel.findById(orderID)
    .populate({
      path: 'orderDetailIDs',
      populate: ['productID', 'reviewID'],
    })
    .populate('userID')
    .populate('paymentMethodID')
    .populate('storeID')
    .populate('receiverAddress')
    .populate({
      path: 'orderStageID',
      populate: {
        path: 'orderStageStatusID',
        populate: { path: 'orderRequestID', populate: 'reasonID' },
      },
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
    // const outOfStockProducts = await inInStock(orders);
    // if (outOfStockProducts.length) {
    //   return new ApiError({
    //     message: HttpMessage.OUT_OF_STOCK,
    //     statusCode: StatusCodes.NOT_FOUND,
    //     data: outOfStockProducts,
    //   });
    // }

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

const inInStock = async (orders: CreateCODPaymentRequestProps['orders']) => {
  console.log(orders);
  const allProducts = orders.flatMap((order) =>
    order.items.map(({ id, name }) => ({ _id: id, name })),
  );
  console.log(allProducts);
  const inStockProducts = await ProductModel.find({
    _id: { $in: allProducts.map(({ _id }) => _id) },
  });

  const outOfStockProducts = allProducts.filter(({ _id }) => {
    return !inStockProducts.some((product) => String(product._id) === _id && product.quantity > 0);
  });

  return outOfStockProducts;
};

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
  tracking,
};
