import mongoose from "mongoose";

export interface OrderProps{
    _id: mongoose.Schema.Types.ObjectId,
    exprDate: Date,
    receiverAddress: string[],
    note: string,
    total: number,
    shipmentCost: number,
    userID: mongoose.Schema.Types.ObjectId,
    storeID: mongoose.Schema.Types.ObjectId,
    orderStatusID: mongoose.Schema.Types.ObjectId,
    paymentMethodID: mongoose.Schema.Types.ObjectId,
    createAt?: Date,
    updateAt?: Date,
}