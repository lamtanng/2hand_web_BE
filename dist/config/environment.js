"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_NAME: process.env.MONGO_NAME,
};
