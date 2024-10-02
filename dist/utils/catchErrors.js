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
exports.catchErrors = void 0;
const ApiError_1 = __importDefault(require("./ApiError"));
const http_status_codes_1 = require("http-status-codes");
const catchErrors = (asyncFunc) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield asyncFunc(req, res, next);
        }
        catch (error) {
            const customError = new ApiError_1.default({
                message: new Error(error).message,
                statusCode: http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY,
            });
            next(customError);
        }
    });
};
exports.catchErrors = catchErrors;
