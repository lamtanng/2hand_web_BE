import { ReasonProps } from "../model/reason.type";

export interface CreateReasonRequest extends Omit<ReasonProps, '_id'> {}
