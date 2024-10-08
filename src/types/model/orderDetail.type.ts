import mongoose from "mongoose";

export interface OrderDetailProps{
    _id: mongoose.Schema.Types.ObjectId,
    quantity: number,
    priceTotal: number,
    productID: mongoose.Schema.Types.ObjectId,
    orderID: mongoose.Schema.Types.ObjectId,
    createAt?: Date,
    updateAt?: Date,
}