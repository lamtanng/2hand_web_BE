import mongoose from "mongoose";

export interface OrderRequestProps{
    _id: mongoose.Schema.Types.ObjectId,
    description: string,
    image: string[],
    video: string[],
    task: string,
    replyStatus: string,
    replyMessage: string,
    reasonID: mongoose.Schema.Types.ObjectId,
    orderID: mongoose.Schema.Types.ObjectId,
    createAt?: Date,
    updateAt?: Date,
}