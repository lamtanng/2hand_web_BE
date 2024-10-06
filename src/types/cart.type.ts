import mongoose from "mongoose";
import { CartItemProps } from "./cartItem.type";

export interface CartProps{
    _id: mongoose.Schema.Types.ObjectId,
    userID: mongoose.Schema.Types.ObjectId,
    products: CartItemProps[],
    createAt?: Date,
    updateAt?: Date,
}