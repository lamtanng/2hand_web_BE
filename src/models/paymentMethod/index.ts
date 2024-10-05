import mongoose from "mongoose";
import { PAYMENTMETHOD_COLLECTION_NAME, PAYMENTMETHOD_COLLECTION_SCHEMA } from "./paymentMethod.doc";

export const PaymentMethodModel = mongoose.model(PAYMENTMETHOD_COLLECTION_NAME, PAYMENTMETHOD_COLLECTION_SCHEMA);