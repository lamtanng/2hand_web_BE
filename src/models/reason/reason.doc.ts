import mongoose, { Schema } from "mongoose";
import { ReasonProps } from "../../types/reason.type";

export interface ReasonDocument extends ReasonProps, Document{}

export const REASON_COLLECTION_NAME = 'reason';
export const REASON_COLLECTION_SCHEMA = new Schema<ReasonDocument>({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: function () {
            return new mongoose.Types.ObjectId();
          }
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    objectType: {
        type: String,
        required: true
    },
    taskType: {
        type: String,
        required: true,
    }
});