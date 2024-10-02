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
exports.loginController = void 0;
const http_status_codes_1 = require("http-status-codes");
const login_service_1 = require("../services/login.service");
const catchErrors_1 = require("../utils/catchErrors");
// post
const login = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //navigate to service layer to execute the business logic
    const result = yield login_service_1.loginService.login(req.body, res);
    res.status(http_status_codes_1.StatusCodes.OK).json(result).send();
}));
exports.loginController = {
    login,
};
