import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { catchServiceFunc } from '../utils/catchErrors';
import {
  CreateNotificationRequest,
  GetNotificationsRequest,
  MarkNotificationAsReadRequest,
  UpdateNotificationRequest,
} from '../types/http/notification.type';
import ApiError from '../utils/classes/ApiError';
import { HttpMessage } from '../constants/httpMessage';
import { Types } from 'mongoose';
import { Server as SocketServer } from 'socket.io';
import { pagination } from '../constants/pagination';
import { deleteEmptyObjectFields } from '../utils/object';
import { NotificationModel } from '../models/notification';

const sendNotification = async (
  notificationData: CreateNotificationRequest[],
  io: SocketServer | null = null,
) => {
  try {
    const notifications = await NotificationModel.insertMany(notificationData);
    if (io) {
      notifications.forEach((notification) => {
        const receiver = String(notification.receiver);
        io.to(receiver).emit('notification', {
          ...notification.toObject(),
          _id: notification._id.toString(),
        });
      });
    }

    return notifications;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const createNotification = async (notificationData: CreateNotificationRequest) => {
  try {
    const newNotification = await NotificationModel.create(notificationData);
    return newNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const createNotificationByRequest = catchServiceFunc(async (req: Request, res: Response) => {
  const notificationData = req.body as CreateNotificationRequest;

  // Use the sendNotification function with io instance from app
  const io = req.app.get('io');
  const newNotification = await sendNotification([notificationData], io);

  return newNotification;
});

const getNotifications = catchServiceFunc(async (req: Request, res: Response) => {
  const { type } = req.query as unknown as GetNotificationsRequest;
  const { page, limit, skip } = pagination(req);

  const userId = req.query._id;
  const filter: any = { receiver: userId };
  if (type) filter.type = type;

  deleteEmptyObjectFields(filter);

  const total = await NotificationModel.countDocuments(filter);

  const notifications = await NotificationModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const hasNextPage = total > page * limit;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  return {
    data: notifications,
    nextPage,
  };
});

const getNotificationById = catchServiceFunc(async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const userId = req.body._id;

  // Find notification by ID, ensuring it belongs to the requesting user
  const notification = await NotificationModel.findOne({
    _id: notificationId,
    receiver: userId,
  });

  // If not found, throw error
  if (!notification) {
    throw new ApiError({
      message: HttpMessage.NOT_FOUND.NOTIFICATION,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return notification;
});

const markAsRead = catchServiceFunc(async (req: Request, res: Response) => {
  const { _id } = req.body as MarkNotificationAsReadRequest;

  const notification = await NotificationModel.findOneAndUpdate(
    { _id },
    { isRead: true },
    { new: true },
  );

  if (!notification) {
    throw new ApiError({
      message: HttpMessage.NOT_FOUND.NOTIFICATION,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return notification;
});

const updateNotification = catchServiceFunc(async (req: Request, res: Response) => {
  const updateData = req.body as UpdateNotificationRequest;
  const userId = req.body._id;

  // Find and update notification, ensuring it belongs to the requesting user
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: updateData._id, receiver: userId },
    updateData,
    { new: true },
  );

  // If not found, throw error
  if (!notification) {
    throw new ApiError({
      message: HttpMessage.NOT_FOUND.NOTIFICATION,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return notification;
});

const deleteNotification = catchServiceFunc(async (req: Request, res: Response) => {
  const notificationId = req.params.id;
  const userId = req.body._id;

  // Find and delete notification, ensuring it belongs to the requesting user
  const notification = await NotificationModel.findOneAndDelete({
    _id: notificationId,
    receiver: userId,
  });

  // If not found, throw error
  if (!notification) {
    throw new ApiError({
      message: HttpMessage.NOT_FOUND.NOTIFICATION,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return { success: true, message: 'Notification deleted successfully' };
});

const countNotification = catchServiceFunc(async (req: Request, res: Response) => {
  let { ids } = req.query as { ids?: string[] | string };

  if (!ids) {
    throw new ApiError({
      message: 'Missing ids parameter',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (typeof ids === 'string') {
    ids = [ids];
  }

  const receiverIds = ids.map((id) => new Types.ObjectId(id));

  const result = await NotificationModel.aggregate([
    { $match: { receiver: { $in: receiverIds } } },
    {
      $group: {
        _id: '$receiver',
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$isRead', true] }, 1, 0] } },
      },
    },
  ]);

  // Format result as required
  const response: Record<string, { total: number; unread: number; read: number }> = {};
  receiverIds.forEach((id) => {
    const found = result.find((r) => String(r._id) === String(id));
    response[String(id)] = {
      total: found?.total || 0,
      unread: found?.unread || 0,
      read: found?.read || 0,
    };
  });

  return response;
});

const deleteAllByReceiver = catchServiceFunc(async (req: Request, res: Response) => {
  const receiverId = req.params.id;
  if (!receiverId) {
    throw new ApiError({
      message: 'Missing receiverId parameter',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
  const result = await NotificationModel.deleteMany({ receiver: new Types.ObjectId(receiverId) });
  return { status: true, deletedCount: result.deletedCount };
});

const markAllAsReadByReceiver = catchServiceFunc(async (req: Request, res: Response) => {
  const receiverId = req.params.id;
  if (!receiverId) {
    throw new ApiError({
      message: 'Missing receiverId parameter',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
  const result = await NotificationModel.updateMany(
    { receiver: new Types.ObjectId(receiverId), isRead: false },
    { $set: { isRead: true } },
  );
  return { status: true, modifiedCount: result.modifiedCount };
});

export const notificationService = {
  sendNotification,
  createNotificationByRequest,
  getNotifications,
  getNotificationById,
  markAsRead,
  updateNotification,
  deleteNotification,
  createNotification,
  countNotification,
  deleteAllByReceiver,
  markAllAsReadByReceiver,
};
