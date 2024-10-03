import mongoose from "mongoose";

export interface CategoryProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    isActive: Boolean,
    createAt?: Date,
    updateAt?: Date,
    parentID: mongoose.Schema.Types.ObjectId,
    childrenID: mongoose.Schema.Types.ObjectId[],
}