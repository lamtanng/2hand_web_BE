"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIs_V1 = void 0;
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const login_routes_1 = require("./login.routes");
const signup_routes_1 = require("./signup.routes");
const routes_1 = require("~/constants/routes");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).send('V1 APIs are already to use !');
});
// Children routes
router.use(routes_1.LOGIN_ROUTE, login_routes_1.loginRoutes);
router.use(routes_1.SIGNUP_ROUTE, signup_routes_1.signupRoutes);
exports.APIs_V1 = router;
