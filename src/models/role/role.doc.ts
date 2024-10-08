import mongoose, { Schema } from 'mongoose';
import { RoleProps } from '../../types/model/role.type';

export interface RoleDocument extends RoleProps, Document {}

export const ROLE_COLLECTION_NAME = 'Role';
export const ROLE_COLLECTION_SCHEMA = new Schema<RoleDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
