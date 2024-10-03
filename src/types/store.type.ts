import mongoose from "mongoose";

export interface StoreProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    slug: String,
    description: String,
    address: String[],
    avatar: String,
    coverImg: String,
    isActive: Boolean,
    createAt?: Date,
    updateAt?: Date,
    userID: mongoose.Schema.Types.ObjectId,
}