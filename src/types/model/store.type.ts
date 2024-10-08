import mongoose from "mongoose";

export interface StoreProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    slug: string,
    description: string,
    address: string[],
    avatar: string,
    coverImg: string,
    isActive: boolean,
    createAt?: Date,
    updateAt?: Date,
    userID: mongoose.Schema.Types.ObjectId,
}