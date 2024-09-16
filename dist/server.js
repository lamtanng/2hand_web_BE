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
const express_1 = __importDefault(require("express"));
const async_exit_hook_1 = __importDefault(require("async-exit-hook"));
const mongodb_1 = require("./config/mongodb");
const startServer = () => {
    const app = (0, express_1.default)();
    const hostname = 'localhost';
    const port = 8017;
    app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(yield (0, mongodb_1.getDB)().listCollections().toArray());
        res.end('<h1>Hello !</h1><hr>');
    }));
    app.listen(port, hostname, () => {
        console.log(`I am running server at ${hostname}:${port}/`);
    });
    (0, async_exit_hook_1.default)(() => {
        console.log('exiting');
    });
};
//anonymous async function (IIFE)
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongodb_1.connectDB)();
        console.log('Connected to MongoDB successfully');
        startServer();
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(0);
    }
}))();
