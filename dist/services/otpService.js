"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.createOTP = void 0;
const env_1 = require("../config/env");
const OTP_1 = require("../models/OTP");
const encryption_1 = require("../utils/encryption");
const logger_1 = require("../utils/logger");
const createOTP = async (userId, purpose) => {
    const code = (0, encryption_1.generateOTPCode)();
    const codeHash = await (0, encryption_1.hashOTP)(code);
    const expiresAt = new Date(Date.now() + env_1.env.otpExpiryMinutes * 60 * 1000);
    await OTP_1.OTP.create({ user: userId, codeHash, purpose, expiresAt });
    logger_1.logger.info(`OTP generated for user ${userId} (${purpose})`, { code });
    return code;
};
exports.createOTP = createOTP;
const verifyOTP = async (userId, purpose, code) => {
    const candidates = await OTP_1.OTP.find({
        user: userId,
        purpose,
        used: false,
    }).sort({ createdAt: -1 });
    for (const candidate of candidates) {
        if (candidate.expiresAt < new Date())
            continue;
        const matches = await (0, encryption_1.compareOTP)(code, candidate.codeHash);
        if (matches) {
            candidate.used = true;
            await candidate.save();
            return true;
        }
    }
    return false;
};
exports.verifyOTP = verifyOTP;
