import mongoose, { Model, Schema } from 'mongoose';
import { NotificationProps } from '../../types/model/notification.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';

export interface INotificationMethods {}
export interface INotificationStatics {}
export interface INotificationQueries {
  paginate: (page: number, limit: number) => any;
}
export interface INotificationModel
  extends Model<NotificationProps, INotificationQueries, INotificationMethods> {}

export const NOTIFICATION_COLLECTION_NAME = 'notification';
export const NOTIFICATION_COLLECTION_SCHEMA = new Schema<
  NotificationProps,
  INotificationModel,
  INotificationStatics,
  INotificationQueries,
  {},
  INotificationMethods
>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    type: {
      type: String,
      required: true,
      enum: ['Order', 'Finance', 'System', 'Product', 'User'],
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);
