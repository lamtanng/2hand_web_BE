import mongoose from "mongoose";

export interface ReportObjectProps{
    type: string,
    objectID: mongoose.Schema.Types.ObjectId,
}