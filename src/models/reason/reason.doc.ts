import mongoose, { Schema } from 'mongoose';
import { ReasonProps } from '../../types/model/reason.type';
import { TaskType } from '../../types/enum/taskType.enum';
import { ObjectType } from '../../types/enum/objectType.enum';
import { Role } from '../../types/enum/role.enum';

export interface ReasonDocument extends ReasonProps, Document {}

export const REASON_COLLECTION_NAME = 'reason';
export const REASON_COLLECTION_SCHEMA = new Schema<ReasonDocument>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return new mongoose.Types.ObjectId();
    },
  },
  name: {
    type: String,
    required: true,
  },
  objectType: {
    type: String,
    required: true,
    enum: {
      values: [...Object.values(ObjectType)],
    },
  },
  taskType: {
    type: String,
    required: true,
    enum: {
      values: [...Object.values(TaskType)],
    },
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: [...Object.values(Role)],
    },
  },
});
