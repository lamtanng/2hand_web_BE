"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const MONGODB_URI = 'mongodb+srv://21110895:5T1SWt6aFLUjckG3@ecomweb.bllwi.mongodb.net/?retryWrites=true&w=majority&appName=eComWeb';
const MONGODB_NAME = 'ecomweb';
let dbInstance = null;
const client = new mongodb_1.MongoClient(MONGODB_URI, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        dbInstance = client.db(MONGODB_NAME);
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
});
exports.connectDB = connectDB;
const getDB = () => {
    if (!dbInstance)
        throw new Error('Must connect to DB before calling getDB');
    return dbInstance;
};
exports.getDB = getDB;
