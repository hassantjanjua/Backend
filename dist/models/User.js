"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    avatarUrl: { type: String },
    tier: {
        type: String,
        enum: ["standard", "gold", "platinum"],
        default: "standard",
    },
    biometricEnabled: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
