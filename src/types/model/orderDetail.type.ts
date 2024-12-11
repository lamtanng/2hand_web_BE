import mongoose from 'mongoose';

export interface OrderDetailProps {
  _id: mongoose.Types.ObjectId;
  quantity: number;
  priceTotal: number;
  productID: mongoose.Types.ObjectId;
  orderID: mongoose.Types.ObjectId;
  reviewID: mongoose.Types.ObjectId;
  createAt?: Date;
  updateAt?: Date;
}
