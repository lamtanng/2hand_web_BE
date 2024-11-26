import mongoose from "mongoose";

export interface ReviewProps{
    _id: mongoose.Types.ObjectId,
    content: string,
    rate: number,
    image: string[],
    video: string[],
    likes: number,
    createAt?: Date,
    updateAt?: Date,
    isActive: boolean,
    replyMessage: string,
    reviewerID: mongoose.Types.ObjectId,
    productID: mongoose.Types.ObjectId,
    orderDetailID: mongoose.Types.ObjectId,
}