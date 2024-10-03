import mongoose from "mongoose"

export interface RoleProps {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    createAt?: Date,
    updateAt?: Date 
}