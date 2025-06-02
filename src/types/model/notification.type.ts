import { Document } from 'mongoose';
import { Types } from 'mongoose';

export enum NotificationType {
  Order = 'Order',
  Finance = 'Finance',
  System = 'System',
  Product = 'Product',
  User = 'User',
}

export interface NotificationProps extends Document {
  _id: Types.ObjectId;
  type: NotificationType;
  title: string;
  content: string;
  receiver: Types.ObjectId;
  relatedId: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
