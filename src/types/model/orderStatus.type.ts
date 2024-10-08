import mongoose from "mongoose";

export interface OrderStatusProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    stage: number,
    createAt?: Date,
    updateAt?: Date,
}