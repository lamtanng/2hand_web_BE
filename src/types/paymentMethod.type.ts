import mongoose from "mongoose";

export interface PaymentMethodProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    createAt?: Date,
    updateAt?: Date,
}