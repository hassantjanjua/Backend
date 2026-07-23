"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = require("mongoose");
const accountSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    label: { type: String, required: true },
    type: {
        type: String,
        enum: ["checking", "savings", "business"],
        required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    currency: { type: String, default: "USD" },
    isPrimary: { type: Boolean, default: false },
}, { timestamps: true });
exports.Account = (0, mongoose_1.model)("Account", accountSchema);
