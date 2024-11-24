import mongoose from "mongoose";
import { ObjectType } from "../enum/objectType.enum";
import { TaskType } from "../enum/taskType.enum";

export interface ReasonProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    objectType: ObjectType,
    taskType: TaskType,
    createAt?: Date,
    updateAt?: Date,
}