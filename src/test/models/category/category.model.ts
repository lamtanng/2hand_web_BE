import mongoose from "mongoose";
import { CATEGORY_COLLECTION_NAME, CATEGORY_COLLECTION_SCHEMA, CategoryDocument } from "./category.schema";

export const CategoryModel = mongoose.model<CategoryDocument>(CATEGORY_COLLECTION_NAME, CATEGORY_COLLECTION_SCHEMA);