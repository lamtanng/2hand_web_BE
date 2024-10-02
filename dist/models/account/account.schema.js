"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_COLLECTION_SCHEMA = exports.ACCOUNT_COLLECTION_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.ACCOUNT_COLLECTION_NAME = 'accounts';
exports.ACCOUNT_COLLECTION_SCHEMA = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});
