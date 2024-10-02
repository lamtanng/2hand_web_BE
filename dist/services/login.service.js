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
exports.loginService = void 0;
const environment_1 = require("../config/environment");
const JwtProvider_1 = require("../providers/JwtProvider");
const ms_1 = __importDefault(require("ms"));
const jwt_1 = require("../utils/jwt");
const login = (reqBody, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = reqBody;
    //check if the user exists
    //if the user exists, check if the password is correct
    //generate a token
    const accessToken = yield JwtProvider_1.JwtProvider.generateToken({
        account,
        secretKey: (0, jwt_1.getSecretKeyFromEnv)(environment_1.env.ACCESS_TOKEN_SECRET_KEY),
        expiresIn: environment_1.env.ACCESS_TOKEN_EXPIRED,
    });
    const refreshToken = yield JwtProvider_1.JwtProvider.generateToken({
        account,
        secretKey: (0, jwt_1.getSecretKeyFromEnv)(environment_1.env.REFRESH_TOKEN_SECRET_KEY),
        expiresIn: environment_1.env.REFRESH_TOKEN_EXPIRED,
    });
    // assign to cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: (0, ms_1.default)(environment_1.env.ACCESS_TOKEN_EXPIRED),
    });
    res.cookie('refreshToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: (0, ms_1.default)(environment_1.env.REFRESH_TOKEN_EXPIRED),
    });
    return Object.assign({ accessToken, refreshToken }, account);
});
exports.loginService = { login };
