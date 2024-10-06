import mongoose from "mongoose";
import { ORDERDETAIL_COLLECTION_NAME, ORDERDETAIL_COLLECTION_SCHEMA } from "./orderDetail.doc";

export const OrderDetailModel = mongoose.model(ORDERDETAIL_COLLECTION_NAME, ORDERDETAIL_COLLECTION_SCHEMA);