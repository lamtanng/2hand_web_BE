import mongoose from "mongoose";
import { ORDERSTATUS_COLLECTION_NAME, ORDERSTATUS_COLLECTION_SCHEMA } from "./orderStatus.doc";

export const OrderStatusModel = mongoose.model(ORDERSTATUS_COLLECTION_NAME, ORDERSTATUS_COLLECTION_SCHEMA);