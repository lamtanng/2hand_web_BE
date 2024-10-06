import mongoose from "mongoose";
import { CART_COLLECTION_NAME, CART_COLLECTION_SCHEMA } from "./cart.doc";

export const CartModel = mongoose.model(CART_COLLECTION_NAME, CART_COLLECTION_SCHEMA);