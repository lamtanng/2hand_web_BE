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
exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const catchErrors_1 = require("../utils/catchErrors");
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().trim().strict(),
    password: joi_1.default.string().min(6).required().trim().strict(),
    confirmPassword: joi_1.default.string().min(6).required().trim().strict().valid(joi_1.default.ref('password')),
});
const signup = (0, catchErrors_1.catchErrors)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield registerSchema.validateAsync(req.body, { abortEarly: false });
    next();
}));
exports.signupValidation = { signup };
