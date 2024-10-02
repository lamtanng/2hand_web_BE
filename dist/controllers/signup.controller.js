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
exports.signupController = void 0;
const catchErrors_1 = require("../utils/catchErrors");
const http_status_codes_1 = require("http-status-codes");
const signup_service_1 = require("../services/signup.service");
// post
const signup = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signup = yield signup_service_1.signupService.signup(req.body);
    res.status(http_status_codes_1.StatusCodes.OK).json(signup).send();
}));
exports.signupController = {
    signup,
};
