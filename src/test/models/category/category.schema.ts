import mongoose, { Schema } from "mongoose";
import { CategoryProps } from "../../types/category.type";

export interface CategoryDocument extends CategoryProps, Document {}

export const CATEGORY_COLLECTION_NAME = "Category";
export const CATEGORY_COLLECTION_SCHEMA = new Schema<CategoryDocument>({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        default: function () { return new mongoose.Types.ObjectId()}
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    parentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY_COLLECTION_NAME,
        default: null,
    },
    childrenID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: CATEGORY_COLLECTION_NAME
    }]
}, {timestamps: true})