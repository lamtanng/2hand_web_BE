import mongoose from 'mongoose';
import { NotificationProps } from '../../types/model/notification.type';
import {
  INotificationModel,
  INotificationQueries,
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
} from './notification.doc';

export const NotificationModel = mongoose.model<
  NotificationProps,
  INotificationModel,
  INotificationQueries
>(NOTIFICATION_COLLECTION_NAME, NOTIFICATION_COLLECTION_SCHEMA);
