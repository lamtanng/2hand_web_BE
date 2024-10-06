import mongoose, { Schema } from "mongoose";
import { ReportObjectProps } from "../../types/reportObject.type";
import { USER_COLLECTION_NAME } from "../user/user.doc";
import { PRODUCT_COLLECTION_NAME } from "../product/product.doc";
import { REVIEW_COLLECTION_NAME } from "../review/review.doc";

export interface ReportObjectDocument extends ReportObjectProps, Document{}

export const REPORTOBJECT_COLLECTION_SCHEMA = new Schema<ReportObjectDocument>({
    type: {
        type: String,
        required: true,
    },
    objectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_COLLECTION_NAME || PRODUCT_COLLECTION_NAME || REVIEW_COLLECTION_NAME,
        required: true,
    }
});