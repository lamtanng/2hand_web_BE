import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { catchErrors } from '../utils/catchErrors';
import { notificationService } from '../services/notification.service';

const createNotification = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.createNotificationByRequest(req, res);
  res.status(StatusCodes.CREATED).json(result).send();
});

const getNotifications = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.getNotifications(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const getNotificationById = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.getNotificationById(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const markAsRead = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.markAsRead(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const updateNotification = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.updateNotification(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const deleteNotification = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.deleteNotification(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const countNotification = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.countNotification(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const deleteAllByReceiver = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.deleteAllByReceiver(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

const markAllAsReadByReceiver = catchErrors(async (req: Request, res: Response) => {
  const result = await notificationService.markAllAsReadByReceiver(req, res);
  res.status(StatusCodes.OK).json(result).send();
});

export const notificationController = {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  updateNotification,
  deleteNotification,
  countNotification,
  deleteAllByReceiver,
  markAllAsReadByReceiver,
};
