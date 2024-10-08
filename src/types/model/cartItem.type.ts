import mongoose from "mongoose";

export interface CartItemProps{
    productID: mongoose.Schema.Types.ObjectId,
    quantity: number,
}