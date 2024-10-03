import mongoose, { Schema } from "mongoose"

export interface RoleProps {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    createAt?: Date,
    updateAt?: Date 
}