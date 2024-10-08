import mongoose from "mongoose";

export interface ReviewProps{
    _id: mongoose.Schema.Types.ObjectId,
    content: string,
    rate: number,
    image: string[],
    video: string[],
    likes: number,
    createAt?: Date,
    updateAt?: Date,
    isActive: boolean,
    replyMessage: string,
    reviewerID: mongoose.Schema.Types.ObjectId,
    productID: mongoose.Schema.Types.ObjectId,
}