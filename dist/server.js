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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// import { closeDB, connectDB } from './config/mongodb';
const v1_1 = require("./routers/v1");
const routes_1 = require("./constants/routes");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const db_mongoose_1 = require("./config/db_mongoose");
const exitHook = require('async-exit-hook');
dotenv_1.default.config();
const startServer = () => {
    const app = (0, express_1.default)();
    // enable req.body json parsing
    app.use(express_1.default.json());
    // V1_API routes
    app.use(routes_1.V1_ROUTE, v1_1.APIs_V1);
    app.listen(8017, 'localhost', () => {
        console.log(`I am running server`);
    });
    //middleware for error handling
    app.use(errorHandler_middleware_1.errorHandler);
    // Close the DB connection when the Node process is terminated
    exitHook(() => {
        // closeDB();
        console.log('Disconnected from MongoDB');
    });
};
//anonymous async function (IIFE)
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_mongoose_1.connectDB)();
        console.log('Connected to MongoDB successfully');
        startServer();
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(0);
    }
}))();
