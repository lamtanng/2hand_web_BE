import mongoose from "mongoose";
import { PRODUCT_COLLECTION_NAME, PRODUCT_COLLECTION_SCHEMA } from "./product.doc";

export const ProductModel = mongoose.model(PRODUCT_COLLECTION_NAME, PRODUCT_COLLECTION_SCHEMA);