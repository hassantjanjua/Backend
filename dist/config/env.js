"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
exports.env = {
    port: Number(process.env.PORT ?? 4000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/gta-banking"),
    jwtSecret: required("JWT_SECRET", "dev-only-change-me"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
    otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES ?? 10),
    // EMAIL SETTINGS
    emailHost: required("EMAIL_HOST"),
    emailPort: Number(required("EMAIL_PORT")),
    emailUser: required("EMAIL_USER"),
    emailPass: required("EMAIL_PASS"),
    emailFrom: required("EMAIL_FROM"),
};
