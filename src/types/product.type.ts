import mongoose from "mongoose";

export interface ProductProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    description: string,
    image: string[],
    price: number,
    quantity: number,
    quality: string,
    slug: string,
    isActive: boolean,
    isSoldOut: boolean,
    createAt?: Date,
    updateAt?: Date,
    cateID: mongoose.Schema.Types.ObjectId,
    storeID: mongoose.Schema.Types.ObjectId,
}