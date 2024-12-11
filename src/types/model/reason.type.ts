    import mongoose from "mongoose";
import { TaskType } from "../enum/taskType.enum";
import { ObjectType } from "../enum/objectType.enum";

export interface ReasonProps{
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    objectType: ObjectType,
    taskType: TaskType,
    createAt?: Date,
    updateAt?: Date,
}