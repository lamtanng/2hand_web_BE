import mongoose from "mongoose";
import { ReportObjectProps } from "./reportObject.type";

export interface ReportProps{
    _id: mongoose.Schema.Types.ObjectId,
    object: ReportObjectProps,
    description: string,
    replyStatus: string,
    replyMessage: string,
    senderID: mongoose.Schema.Types.ObjectId,
    reasonID: mongoose.Schema.Types.ObjectId,
    createAt?: Date,
    updateAt?: Date,
}