import mongoose from 'mongoose';

export interface CategoryProps {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createAt?: Date;
  updateAt?: Date;
  parentID: mongoose.Types.ObjectId;
  childrenIDs: mongoose.Types.ObjectId[];
}
