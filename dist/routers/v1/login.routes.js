"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.route('/').get((req, res) => {
    res.status(200).send('Login page');
});
exports.loginRoutes = router;
