import mongoose from "mongoose";
import { ORDERREQUEST_COLLECTION_NAME, ORDERREQUEST_COLLECTION_SCHEMA } from "./orderRequest.doc";

export const OrderRequestModel = mongoose.model(ORDERREQUEST_COLLECTION_NAME, ORDERREQUEST_COLLECTION_SCHEMA);