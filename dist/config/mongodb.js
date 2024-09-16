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
exports.closeDB = exports.getDB = exports.connectDB = void 0;
const mongodb_1 = require("mongodb");
const environment_1 = require("./environment");
let dbInstance = null;
let client = new mongodb_1.MongoClient(environment_1.env.MONGO_URI, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        dbInstance = client.db(environment_1.env.MONGO_NAME);
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
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.close();
});
exports.closeDB = closeDB;
