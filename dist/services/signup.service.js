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
exports.signupService = void 0;
const account_1 = require("../models/account");
const signup = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const account = {
        email: reqBody.email,
        password: reqBody.password,
        createdAt: new Date(),
    };
    const res = yield account_1.AccountModel.create(account);
    const newAccount = yield account_1.AccountModel.findById(res._id);
    console.log('compare:', yield res.comparePassword('123456'));
    return newAccount;
});
exports.signupService = { signup };
