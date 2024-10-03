import mongoose, { ObjectId, Schema } from "mongoose";

export interface UserProps{
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phoneNumber: String,
    dateOfBirth: Date,
    address: String[];
    createAt?: Date,
    updateAt?: Date,
    isActive: Boolean,
    isVerified: Boolean,
    roleID: mongoose.Schema.Types.ObjectId[] ,
    followerID?: mongoose.Schema.Types.ObjectId[],
    followingID?: mongoose.Schema.Types.ObjectId[],
    blockedID?: mongoose.Schema.Types.ObjectId[]
};