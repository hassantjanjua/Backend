"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const timestamp = () => new Date().toISOString();
exports.logger = {
    info: (message, meta) => console.log(`[${timestamp()}] INFO  ${message}`, meta ?? ""),
    warn: (message, meta) => console.warn(`[${timestamp()}] WARN  ${message}`, meta ?? ""),
    error: (message, meta) => console.error(`[${timestamp()}] ERROR ${message}`, meta ?? ""),
};
