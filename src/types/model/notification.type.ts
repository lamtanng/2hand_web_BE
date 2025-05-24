import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type NotificationType = 'Order' | 'Finance' | 'System' | 'Product' | 'User';

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
