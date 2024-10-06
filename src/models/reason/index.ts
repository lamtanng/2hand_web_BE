import mongoose from "mongoose";
import { REASON_COLLECTION_NAME, REASON_COLLECTION_SCHEMA } from "./reason.doc";

export const ReasonModel = mongoose.model(REASON_COLLECTION_NAME, REASON_COLLECTION_SCHEMA);