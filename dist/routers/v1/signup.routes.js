"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const signup_validation_1 = require("../../validations/signup.validation");
const signup_controller_1 = require("../../controllers/signup.controller");
const router = express_1.default.Router();
router.route('/').post(signup_validation_1.signupValidation.signup, signup_controller_1.signupController.signup);
exports.signupRoutes = router;
