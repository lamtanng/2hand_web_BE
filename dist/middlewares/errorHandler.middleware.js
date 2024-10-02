"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const environment_1 = require("../config/environment");
const errorHandler = (err, req, res, next) => {
    const responseError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR,
        stack: environment_1.env.BUILD_MODE === 'dev' ? err.stack : {},
    };
    // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
    // Return the response to the frontend
    res.status(responseError.statusCode).json(responseError);
};
exports.errorHandler = errorHandler;
