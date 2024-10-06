import mongoose from "mongoose";
import { ORDER_COLLECTION_NAME, ORDER_COLLECTION_SCHEMA } from "./order.doc";

export const OrderModel = mongoose.model(ORDER_COLLECTION_NAME, ORDER_COLLECTION_SCHEMA);