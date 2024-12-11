import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import { deleteEmptyObjectFields, parseJson } from '../utils/object';
import mongoose from 'mongoose';
import { OrderModel } from '../models/order';
import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';
import { UserModel } from '../models/user';
import { OrderProps } from '../types/model/order.type';

interface OrderStatisticsQueryParams extends Pick<OrderProps, 'storeID'> {
  startAt: Date;
  endAt: Date;
}

const statistics = catchServiceFunc(async (req: Request, res: Response) => {
  const storeID = parseJson(req.query.storeID as string);
  const startDate = parseJson(req.query.startDate as string);
  const endDate = parseJson(req.query.endDate as string);

  function getDateRanges(date: Date) {
    const newDate = new Date(date);
    // Lấy ngày đầu tuần (Thứ Hai)
    const weekStart = new Date(newDate);
    weekStart.setDate(newDate.getDate() - newDate.getDay() + 1); // Thứ Hai là ngày 1
    if (newDate.getDay() === 0) {
      weekStart.setDate(newDate.getDate() - 6); // Chủ Nhật là ngày cuối cùng của tuần trước
    }

    // Lấy ngày cuối tuần (Chủ Nhật)
    const weekEnd = new Date(newDate);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Lấy ngày đầu tháng
    const monthStart = new Date(newDate.getFullYear(), newDate.getMonth(), 1);

    // Lấy ngày cuối tháng
    const monthEnd = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);

    // Lấy ngày đầu năm
    const yearStart = new Date(newDate.getFullYear(), 0, 1);

    // Lấy ngày cuối năm
    const yearEnd = new Date(newDate.getFullYear(), 11, 31);

    return { newDate, weekStart, weekEnd, monthStart, monthEnd, yearStart, yearEnd };
  }

  const datee = getDateRanges(new Date(2024, 11, 15, 12, 10, 0));

  const findQuery = {
    createdAt: {
      $gte: datee.yearStart,
      $lte: datee.yearEnd,
    },
    storeID: storeID ? new mongoose.Types.ObjectId(storeID) : null,
  };
  deleteEmptyObjectFields(findQuery);

  const orders = await getOrderStatistics(findQuery);
  const productTotal = await ProductModel.find(findQuery).countDocuments();
  const storeTotal = await StoreModel.find(findQuery).countDocuments();
  const userTotal = await UserModel.find(findQuery).countDocuments();

  return { orders, productTotal, storeTotal, userTotal };
});

const getOrderStatistics = async (findQuery: Object) => {
  const orders = await OrderModel.aggregate([
    {
      $match: findQuery,
    },
    {
      $lookup: {
        from: 'orderstages', // Tên collection của OrderStageModel
        localField: 'orderStageID',
        foreignField: '_id',
        as: 'stage',
      },
    },
    {
      $unwind: '$stage',
    },
    {
      $group: {
        _id: '$stage.name',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' },
      },
    },
  ]);
  return orders;
};

export const adminService = { statistics, getOrderStatistics };
