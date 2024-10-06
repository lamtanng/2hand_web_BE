import mongoose from "mongoose";

export interface ReasonProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    objectType: string,
    taskType: string,
    createAt?: Date,
    updateAt?: Date,
}