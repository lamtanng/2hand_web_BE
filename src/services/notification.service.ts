import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { NotificationModel } from '../models/notification';
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

const sendNotification = async (
  notificationData: CreateNotificationRequest,
  io: SocketServer | null = null,
) => {
  try {
    const receiver = String(notificationData.receiver);
    // Create notification in database
    const notification = await NotificationModel.create(notificationData);
    // Emit to specific user using their room (userID as room name) if io instance exists
    if (io) {
      io.to(receiver).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const createNotification = catchServiceFunc(async (req: Request, res: Response) => {
  const notificationData = req.body as CreateNotificationRequest;

  // Use the sendNotification function with io instance from app
  const io = req.app.get('io');
  const newNotification = await sendNotification(notificationData, io);

  return newNotification;
});

const getNotifications = catchServiceFunc(async (req: Request, res: Response) => {
  const { type } = req.query as unknown as GetNotificationsRequest;
  const { page, limit, skip } = pagination(req);

  const userId = req.body._id;
  const filter: any = { receiver: userId };
  if (type) filter.type = type;

  const total = await NotificationModel.countDocuments(filter);

  const notifications = await NotificationModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const hasNextPage = total > page * limit;
  const nextPage = hasNextPage ? Number(page) + 1 : null;

  return {
    notifications,
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
  const userId = req.body._id;

  // Find and update notification, ensuring it belongs to the requesting user
  const notification = await NotificationModel.findOneAndUpdate(
    { _id, receiver: userId },
    { isRead: true },
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

export const notificationService = {
  sendNotification,
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  updateNotification,
  deleteNotification,
};
