"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const login_validation_1 = require("../../validations/login.validation");
const login_controller_1 = require("../../controllers/login.controller");
const router = express_1.default.Router();
router
    .route('/')
    .post(login_validation_1.loginValidation.login, login_controller_1.loginController.login);
exports.loginRoutes = router;
