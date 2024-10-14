import mongoose from 'mongoose';

export interface RemoveCartItemRequestProps {
  userID: mongoose.Schema.Types.ObjectId;
  productID: mongoose.Schema.Types.ObjectId;
}