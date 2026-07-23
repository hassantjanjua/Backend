"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    codeHash: { type: String, required: true },
    purpose: {
        type: String,
        enum: ["register", "reset_password"],
        required: true,
    },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.OTP = (0, mongoose_1.model)("OTP", otpSchema);
