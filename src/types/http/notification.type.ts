import { Types } from 'mongoose';
import { NotificationType } from '../model/notification.type';

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  content: string;
  receiver: Types.ObjectId | string;
}

export interface UpdateNotificationRequest {
  _id: Types.ObjectId | string;
  type?: NotificationType;
  title?: string;
  content?: string;
  isRead?: boolean;
}

export interface MarkNotificationAsReadRequest {
  _id: Types.ObjectId | string;
}

export interface GetNotificationsRequest {
  limit?: number;
  type?: NotificationType;
  page?: number;
}
