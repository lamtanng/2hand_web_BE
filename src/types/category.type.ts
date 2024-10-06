import mongoose from "mongoose";

export interface CategoryProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    isActive: boolean,
    createAt?: Date,
    updateAt?: Date,
    parentID: mongoose.Schema.Types.ObjectId,
}