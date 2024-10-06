import mongoose, { Schema } from "mongoose";
import { CartItemProps } from "../../types/cartItem.type";
import { PRODUCT_COLLECTION_NAME } from "../product/product.doc";
import { number } from "joi";

export interface CartItemDocument extends CartItemProps, Document{}

export const CARTITEM_SCHEMA = new Schema<CartItemDocument>({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: PRODUCT_COLLECTION_NAME,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
});