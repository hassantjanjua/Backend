"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ["deposit", "withdraw", "transfer", "security", "promo"],
        required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });
exports.Notification = (0, mongoose_1.model)("Notification", notificationSchema);
