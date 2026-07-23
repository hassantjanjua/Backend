"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = exports.asyncHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    if (statusCode >= 500) {
        logger_1.logger.error(err.message, { stack: err.stack, path: req.path });
    }
    res.status(statusCode).json({
        error: err.message || "Internal server error",
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
};
exports.notFoundHandler = notFoundHandler;
