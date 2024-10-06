import mongoose from "mongoose";
import { REPORT_COLLECTION_NAME, REPORT_COLLECTION_SCHEMA } from "./report.doc";

export const ReportModel = mongoose.model(REPORT_COLLECTION_NAME, REPORT_COLLECTION_SCHEMA);