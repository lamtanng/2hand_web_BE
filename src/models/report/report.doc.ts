import mongoose, { Schema } from 'mongoose';
import { ReportProps } from '../../types/model/report.type';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { REASON_COLLECTION_NAME } from '../reason/reason.doc';
import { REPORTOBJECT_SCHEMA } from '../reportObject/reportObject.doc';

export interface ReportDocument extends ReportProps, Document {}

export const REPORT_COLLECTION_NAME = 'report';
export const REPORT_COLLECTION_SCHEMA = new Schema<ReportDocument>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: function () {
        return new mongoose.Types.ObjectId();
      },
    },
    object: {
      type: REPORTOBJECT_SCHEMA,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    replyStatus: {
      type: String,
      enum: {
        values: ['pending', 'succeeded', 'rejected'],
      },
      default: 'pending',
    },
    replyMessage: {
      type: String,
      default: null,
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: USER_COLLECTION_NAME,
      required: true,
    },
    reasonID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: REASON_COLLECTION_NAME,
      required: true,
    },
  },
  { timestamps: true },
);
