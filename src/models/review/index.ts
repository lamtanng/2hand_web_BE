import mongoose from "mongoose";
import { REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA } from "./review.doc";

export const ReviewModel = mongoose.model(REVIEW_COLLECTION_NAME, REVIEW_COLLECTION_SCHEMA);