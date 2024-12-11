import mongoose from 'mongoose';
import { TaskType } from '../enum/taskType.enum';
import { ObjectType } from '../enum/objectType.enum';
import { Role } from '../enum/role.enum';

export interface ReasonProps {
  _id: mongoose.Types.ObjectId;
  name: string;
  objectType: ObjectType;
  taskType: TaskType;
  role: Role;
  createAt?: Date;
  updateAt?: Date;
}
