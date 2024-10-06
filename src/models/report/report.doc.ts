import mongoose, { Schema } from 'mongoose';
import { ReportProps } from '../../types/report.type';
import { REPORTOBJECT_COLLECTION_SCHEMA } from '../reportObject/reportObject.doc';
import { USER_COLLECTION_NAME } from '../user/user.doc';
import { REASON_COLLECTION_NAME } from '../reason/reason.doc';

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
      type: Map,
      of: REPORTOBJECT_COLLECTION_SCHEMA,
      required: true,
    },
    description: {
      type: String,
    },
    replyStatus: {
      type: String,
    },
    replyMessage: {
      type: String,
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
